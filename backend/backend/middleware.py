from django.core.cache import cache
from django.http import JsonResponse
from django.conf import settings
import time

class RateLimitMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Only apply rate limiting to login endpoint
        if request.path == '/auth/login/' and request.method == 'POST':
            ip_address = self.get_client_ip(request)
            username = request.POST.get('username', '')
            
            # Create a unique key for this IP and username combination
            cache_key = f'login_attempts_{ip_address}_{username}'
            
            # Get current attempts
            attempts = cache.get(cache_key, {'count': 0, 'blocked_until': 0})
            
            # Check if user is blocked
            if attempts['blocked_until'] > time.time():
                remaining_time = int(attempts['blocked_until'] - time.time())
                return JsonResponse({
                    'detail': f'Too many login attempts. Please try again in {remaining_time} seconds.'
                }, status=429)
            
            # Check if we should block the user
            if attempts['count'] >= settings.RATE_LIMIT_ATTEMPTS:
                block_until = time.time() + settings.RATE_LIMIT_BLOCK_TIME
                cache.set(cache_key, {
                    'count': attempts['count'],
                    'blocked_until': block_until
                }, settings.RATE_LIMIT_BLOCK_TIME)
                return JsonResponse({
                    'detail': f'Too many login attempts. Please try again in {settings.RATE_LIMIT_BLOCK_TIME} seconds.'
                }, status=429)
            
            # Increment attempt counter
            attempts['count'] += 1
            cache.set(cache_key, attempts, settings.RATE_LIMIT_WINDOW)
            
            # If login is successful, clear the attempts
            response = self.get_response(request)
            if response.status_code == 200:
                cache.delete(cache_key)
            return response
            
        return self.get_response(request)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip 