// Advanced AdSense Optimization Script
(function() {
    // Ad loading optimization
    function loadAds() {
        // Only load ads when page is visible
        if (document.visibilityState === 'visible') {
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX';
            document.head.appendChild(script);
        }
    }

    // Load ads when page becomes visible
    document.addEventListener('visibilitychange', loadAds);
    window.addEventListener('load', loadAds);

    // Ad position optimization
    function optimizeAdPositions() {
        const adContainers = document.querySelectorAll('.ad-container');
        
        adContainers.forEach(container => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Load ad when container is visible
                        const adElement = container.querySelector('.adsbygoogle');
                        if (adElement && !adElement.hasAttribute('data-adsbygoogle-status')) {
                            (adsbygoogle = window.adsbygoogle || []).push({});
                        }
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(container);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', optimizeAdPositions);
    } else {
        optimizeAdPositions();
    }
})();
