// Night Mode Toggle
const modeToggle = document.getElementById('modeToggle');
const modeIcon = modeToggle ? modeToggle.querySelector('i') : null;

// Check for saved theme preference or respect OS preference
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('night-mode');
        if (modeIcon) {
            modeIcon.classList.remove('fa-moon');
            modeIcon.classList.add('fa-sun');
        }
    }
}

if (modeToggle && modeIcon) {
    modeToggle.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
        
        if (document.body.classList.contains('night-mode')) {
            modeIcon.classList.remove('fa-moon');
            modeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            modeIcon.classList.remove('fa-sun');
            modeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Initialize theme when page loads
document.addEventListener('DOMContentLoaded', initTheme);
