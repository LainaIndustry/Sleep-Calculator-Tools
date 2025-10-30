// Google Analytics and Performance Tracking
(function() {
    // Google Analytics 4
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX'); // Replace with your GA4 ID

    // Performance monitoring
    window.addEventListener('load', function() {
        // Track Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            gtag('event', 'LCP', {
                'event_category': 'Performance',
                'event_label': 'Largest Contentful Paint',
                'value': Math.round(lastEntry.renderTime || lastEntry.loadTime)
            });
        });
        lcpObserver.observe({entryTypes: ['largest-contentful-paint']});

        // Track First Input Delay (FID)
        const fidObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                gtag('event', 'FID', {
                    'event_category': 'Performance',
                    'event_label': 'First Input Delay',
                    'value': Math.round(entry.processingStart - entry.startTime)
                });
            });
        });
        fidObserver.observe({entryTypes: ['first-input']});

        // Track Cumulative Layout Shift (CLS)
        let clsValue = 0;
        let clsEntries = [];
        let sessionValue = 0;
        
        const clsObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    sessionValue += entry.value;
                }
            }
        });
        clsObserver.observe({entryTypes: ['layout-shift']});

        // Report CLS when page is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                gtag('event', 'CLS', {
                    'event_category': 'Performance',
                    'event_label': 'Cumulative Layout Shift',
                    'value': Math.round(sessionValue * 1000) / 1000
                });
            }
        });
    });

    // Track user interactions
    document.addEventListener('DOMContentLoaded', function() {
        // Track calculator usage
        const calculateButtons = document.querySelectorAll('.btn');
        calculateButtons.forEach(button => {
            button.addEventListener('click', function() {
                gtag('event', 'calculator_used', {
                    'event_category': 'Engagement',
                    'event_label': this.textContent.trim()
                });
            });
        });

        // Track navigation
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                gtag('event', 'navigation', {
                    'event_category': 'Navigation',
                    'event_label': this.textContent.trim()
                });
            });
        });

        // Track time on page
        let pageLoadTime = Date.now();
        window.addEventListener('beforeunload', function() {
            const timeSpent = Math.round((Date.now() - pageLoadTime) / 1000);
            gtag('event', 'time_spent', {
                'event_category': 'Engagement',
                'event_label': document.title,
                'value': timeSpent
            });
        });
    });

    // Error tracking
    window.addEventListener('error', function(e) {
        gtag('event', 'error', {
            'event_category': 'Error',
            'event_label': e.message,
            'non_interaction': true
        });
    });

    // Ad performance tracking
    window.addEventListener('load', function() {
        // Track ad visibility
        const adContainers = document.querySelectorAll('.ad-container');
        const adObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gtag('event', 'ad_view', {
                        'event_category': 'Ad Performance',
                        'event_label': 'Ad Visible',
                        'non_interaction': true
                    });
                }
            });
        }, { threshold: 0.5 });

        adContainers.forEach(container => {
            adObserver.observe(container);
        });
    });
})();

// Enhanced Ecommerce Tracking for Affiliate Links
function trackAffiliateClick(linkText, productName) {
    gtag('event', 'affiliate_click', {
        'event_category': 'Affiliate',
        'event_label': productName,
        'link_text': linkText
    });
}

// Conversion tracking for newsletter signups
function trackNewsletterSignup() {
    gtag('event', 'newsletter_signup', {
        'event_category': 'Conversion',
        'event_label': 'Newsletter Subscription'
    });
}
