from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from journal.models import UserUsage
from datetime import datetime, timedelta
import json

User = get_user_model()

class Command(BaseCommand):
    help = 'Adds test dates to UserUsage for testing the contribution graph'

    def handle(self, *args, **options):
        # Get the user named "e"
        try:
            user = User.objects.get(username="e")
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR('User "e" not found'))
            return

        # Get or create UserUsage for the user
        usage, created = UserUsage.objects.get_or_create(user=user)
        
        # Generate dates for the last 30 days, with some gaps
        today = datetime.now().date()
        dates = []
        for i in range(30):
            date = today - timedelta(days=i)
            # Skip some days to create gaps
            if i % 3 != 0:  # This will create gaps every 3 days
                dates.append(date.isoformat())
        
        # Update the dates
        usage.dates = dates
        usage.save()
        
        self.stdout.write(self.style.SUCCESS(f'Successfully added test dates for user {user.username}'))
        self.stdout.write(f'Dates: {json.dumps(dates, indent=2)}') 