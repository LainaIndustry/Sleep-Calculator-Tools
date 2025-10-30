// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Tab functionality
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to current tab and content
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Update current time for bedtime tab
    function updateCurrentTime() {
        const now = new Date();
        const currentTimeElement = document.getElementById('current-time');
        if (currentTimeElement) {
            currentTimeElement.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }
    }

    // Update time initially and every minute
    updateCurrentTime();
    setInterval(updateCurrentTime, 60000);

    // Back link functionality
    const backLink = document.getElementById('back-link');
    if (backLink) {
        backLink.addEventListener('click', function(e) {
            e.preventDefault();
            const results = document.getElementById('results');
            results.style.display = 'none';
        });
    }

    // Initialize AdSense
    initializeAds();
});

// Ad initialization
function initializeAds() {
    // AdSense will auto-load with the script in head
    console.log('AdSense initialized');
}
