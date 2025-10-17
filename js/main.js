// Main JavaScript for SleepWell Tool

// Toggle Navigation for Mobile
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });

    // Close navigation when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !e.target.closest('nav') && 
            !e.target.closest('.nav-toggle')) {
            mainNav.classList.remove('active');
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', showTooltip);
        tooltip.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltipText = this.getAttribute('data-tooltip');
    const tooltipEl = document.createElement('div');
    tooltipEl.className = 'tooltip';
    tooltipEl.textContent = tooltipText;
    document.body.appendChild(tooltipEl);

    const rect = this.getBoundingClientRect();
    tooltipEl.style.left = rect.left + (rect.width / 2) - (tooltipEl.offsetWidth / 2) + 'px';
    tooltipEl.style.top = (rect.top - tooltipEl.offsetHeight - 5) + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initTooltips();
    
    // Add loading state to buttons
    const buttons = document.querySelectorAll('button, .tool-button, .cta-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1000);
        });
    });
});
