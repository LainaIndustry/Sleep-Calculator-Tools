// Advanced Ad Management for Maximum Revenue
class AdManager {
    constructor() {
        this.adSlots = {};
        this.adRefreshRate = 30; // minutes
        this.init();
    }

    init() {
        this.initializeAdSlots();
        this.setupAdRefresh();
        this.optimizeAdPlacements();
        this.trackAdPerformance();
    }

    initializeAdSlots() {
        // Define ad slots and their configurations
        this.adSlots = {
            leaderboard: {
                element: null,
                client: 'ca-pub-XXXXXXXXXXXXXXXX',
                slot: '1234567890',
                format: 'auto',
                responsive: true
            },
            rectangle: {
                element: null,
                client: 'ca-pub-XXXXXXXXXXXXXXXX',
                slot: '0987654321',
                format: 'rectangle',
                responsive: true
            },
            inContent: {
                element: null,
                client: 'ca-pub-XXXXXXXXXXXXXXXX',
                slot: '1122334455',
                format: 'auto',
                responsive: true
            }
        };

        // Initialize each ad slot
        Object.keys(this.adSlots).forEach(slotName => {
            this.initializeAdSlot(slotName);
        });
    }

    initializeAdSlot(slotName) {
        const slot = this.adSlots[slotName];
        const adElement = document.querySelector(`[data-ad-slot="${slot.slot}"]`);
        
        if (adElement) {
            slot.element = adElement;
            this.loadAd(slotName);
        }
    }

    loadAd(slotName) {
        const slot = this.adSlots[slotName];
        if (!slot.element || slot.loaded) return;

        try {
            (adsbygoogle = window.adsbygoogle || []).push({});
            slot.loaded = true;
            
            gtag('event', 'ad_load', {
                'event_category': 'Ad Performance',
                'event_label': slotName,
                'non_interaction': true
            });
        } catch (error) {
            console.error(`Error loading ad ${slotName}:`, error);
        }
    }

    setupAdRefresh() {
        // Refresh ads periodically (respecting AdSense policies)
        setInterval(() => {
            this.refreshAds();
        }, this.adRefreshRate * 60 * 1000);
    }

    refreshAds() {
        Object.keys(this.adSlots).forEach(slotName => {
            const slot = this.adSlots[slotName];
            if (slot.element && this.isAdVisible(slot.element)) {
                this.reloadAd(slotName);
            }
        });
    }

    reloadAd(slotName) {
        const slot = this.adSlots[slotName];
        if (!slot.element) return;

        // Create new ad container
        const newAdElement = document.createElement('ins');
        newAdElement.className = 'adsbygoogle';
        newAdElement.style.display = 'block';
        newAdElement.setAttribute('data-ad-client', slot.client);
        newAdElement.setAttribute('data-ad-slot', slot.slot);
        newAdElement.setAttribute('data-ad-format', slot.format);
        newAdElement.setAttribute('data-full-width-responsive', slot.responsive ? 'true' : 'false');

        // Replace old ad
        slot.element.parentNode.replaceChild(newAdElement, slot.element);
        slot.element = newAdElement;
        slot.loaded = false;

        // Load new ad
        setTimeout(() => {
            this.loadAd(slotName);
        }, 100);
    }

    isAdVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    optimizeAdPlacements() {
        // Dynamic ad placement based on content length
        this.placeInContentAds();
        
        // Sticky sidebar ads for desktop
        this.createStickyAds();
        
        // Intersection Observer for lazy loading
        this.setupLazyLoading();
    }

    placeInContentAds() {
        const articles = document.querySelectorAll('.blog-post-content, .calculator-section');
        articles.forEach(article => {
            const paragraphs = article.querySelectorAll('p');
            
            // Place ads after every 3rd paragraph in long content
            paragraphs.forEach((paragraph, index) => {
                if ((index + 1) % 3 === 0 && index > 0) {
                    this.insertInContentAd(paragraph);
                }
            });
        });
    }

    insertInContentAd(afterElement) {
        const adContainer = document.createElement('div');
        adContainer.className = 'ad-container in-content-ad';
        adContainer.innerHTML = `
            <div class="ad-label">Advertisement</div>
            <ins class="adsbygoogle"
                 style="display:block; text-align:center;"
                 data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                 data-ad-slot="1122334455"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        `;
        
        afterElement.parentNode.insertBefore(adContainer, afterElement.nextSibling);
        
        // Load the ad
        setTimeout(() => {
            (adsbygoogle = window.adsbygoogle || []).push({});
        }, 500);
    }

    createStickyAds() {
        if (window.innerWidth > 768) {
            const sidebarAd = document.createElement('div');
            sidebarAd.className = 'sticky-ad';
            sidebarAd.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                width: 300px;
                z-index: 99;
            `;
            sidebarAd.innerHTML = `
                <div class="ad-container">
                    <div class="ad-label">Advertisement</div>
                    <ins class="adsbygoogle"
                         style="display:block"
                         data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                         data-ad-slot="3344556677"
                         data-ad-format="rectangle"
                         data-full-width-responsive="true"></ins>
                </div>
            `;
            
            document.body.appendChild(sidebarAd);
            
            // Load sticky ad
            setTimeout(() => {
                (adsbygoogle = window.adsbygoogle || []).push({});
            }, 1000);
        }
    }

    setupLazyLoading() {
        const adObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const adElement = entry.target;
                    const slotName = this.getSlotNameFromElement(adElement);
                    if (slotName && !this.adSlots[slotName].loaded) {
                        this.loadAd(slotName);
                    }
                }
            });
        }, { threshold: 0.1 });

        // Observe all ad containers
        document.querySelectorAll('.ad-container').forEach(container => {
            adObserver.observe(container);
        });
    }

    getSlotNameFromElement(element) {
        const adSlot = element.querySelector('ins');
        if (!adSlot) return null;
        
        const slotId = adSlot.getAttribute('data-ad-slot');
        return Object.keys(this.adSlots).find(slotName => 
            this.adSlots[slotName].slot === slotId
        );
    }

    trackAdPerformance() {
        // Track ad clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.adsbygoogle')) {
                gtag('event', 'ad_click', {
                    'event_category': 'Ad Performance',
                    'event_label': 'Ad Click'
                });
            }
        });

        // Track ad visibility over time
        const visibilityObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const startTime = Date.now();
                    const adElement = entry.target;
                    
                    const visibilityTimer = setInterval(() => {
                        if (!this.isAdVisible(adElement)) {
                            clearInterval(visibilityTimer);
                            const viewTime = Date.now() - startTime;
                            
                            gtag('event', 'ad_view_time', {
                                'event_category': 'Ad Performance',
                                'event_label': 'Ad View Duration',
                                'value': Math.round(viewTime / 1000)
                            });
                        }
                    }, 1000);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.ad-container').forEach(container => {
            visibilityObserver.observe(container);
        });
    }
}

// Initialize Ad Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.adManager = new AdManager();
});

// Fallback ads for when AdSense is blocked
function loadFallbackAds() {
    const fallbackAds = [
        {
            image: '/images/ads/sleep-mattress.jpg',
            title: 'Best Sleep Mattress 2025',
            description: 'Rated #1 by sleep experts',
            url: 'https://example.com/mattress?ref=sleepcalculator',
            cta: 'Shop Now'
        },
        {
            image: '/images/ads/sleep-tracker.jpg',
            title: 'Advanced Sleep Tracker',
            description: 'Monitor your sleep patterns',
            url: 'https://example.com/tracker?ref=sleepcalculator',
            cta: 'Learn More'
        }
    ];

    const adContainers = document.querySelectorAll('.ad-container');
    adContainers.forEach((container, index) => {
        const ad = fallbackAds[index % fallbackAds.length];
        if (ad && !container.querySelector('ins').offsetParent) {
            container.innerHTML = `
                <div class="fallback-ad">
                    <a href="${ad.url}" onclick="trackAffiliateClick('${ad.title}', '${ad.title}')" target="_blank">
                        <img src="${ad.image}" alt="${ad.title}" loading="lazy">
                        <div class="fallback-ad-content">
                            <h4>${ad.title}</h4>
                            <p>${ad.description}</p>
                            <span class="fallback-cta">${ad.cta}</span>
                        </div>
                    </a>
                </div>
            `;
        }
    });
}

// Check if AdSense is blocked and load fallback ads
setTimeout(() => {
    const adContainers = document.querySelectorAll('.ad-container');
    const hasActiveAds = Array.from(adContainers).some(container => 
        container.querySelector('ins')?.offsetHeight > 0
    );
    
    if (!hasActiveAds && adContainers.length > 0) {
        loadFallbackAds();
    }
}, 3000);
