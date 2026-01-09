import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
}

export default function SEO({
    title = "10th Step Journal | Anonymous AA Step 10 Daily Inventory ",
    description = "A free, anonymous 10th Step journal based on AA's Step 10 inventory. No ads, no account requirements, and no personal data collection. Fully customizable and private.",
    keywords = "10th step, AA, sobriety tracker, NA, step 10 inventory, addiction recovery, sobriety app, 10th step journal",
    image = "https://10stepjournal.com/logo512.png",
    url = "https://10stepjournal.com",
    type = "website"
}: SEOProps) {
    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebApplication",
                    "name": title,
                    "description": description,
                    "url": url,
                    "applicationCategory": "LifestyleApplication",
                    "operatingSystem": "Web",
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                    }
                })}
            </script>
        </Helmet>
    );
} 