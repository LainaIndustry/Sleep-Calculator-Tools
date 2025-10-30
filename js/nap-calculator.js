// Nap Calculator Functionality
document.addEventListener('DOMContentLoaded', function() {
    const calculateNapBtn = document.getElementById('calculate-nap');
    const napTimeInput = document.getElementById('nap-time');
    const napResultsSection = document.getElementById('nap-results');
    const napResultsTitle = document.getElementById('nap-results-title');
    const napResultsList = document.getElementById('nap-results-list');
    const napBackLink = document.getElementById('nap-back-link');

    // Set current time as default
    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5);
    napTimeInput.value = currentTime;

    if (calculateNapBtn) {
        calculateNapBtn.addEventListener('click', function() {
            const napTime = napTimeInput.value;
            calculateNapTimes(napTime);
        });
    }

    if (napBackLink) {
        napBackLink.addEventListener('click', function(e) {
            e.preventDefault();
            napResultsSection.style.display = 'none';
        });
    }

    function calculateNapTimes(napTime) {
        if (!napTime) {
            alert('Please enter a nap time');
            return;
        }

        const [hours, minutes] = napTime.split(':').map(Number);
        const napDate = new Date();
        napDate.setHours(hours, minutes, 0, 0);

        // If nap time is earlier than current time, assume it's for tomorrow
        if (napDate < new Date()) {
            napDate.setDate(napDate.getDate() + 1);
        }

        const napDurations = [
            { name: "Power Nap", duration: 20, description: "Quick energy boost, no grogginess" },
            { name: "Coffee Nap", duration: 15, description: "Take before coffee for maximum effect" },
            { name: "Full Cycle Nap", duration: 90, description: "Complete sleep cycle, enhances creativity" },
            { name: "Two Cycles", duration: 180, description: "Two full cycles, deep restoration" }
        ];

        const results = [];

        napDurations.forEach(nap => {
            const wakeupTime = new Date(napDate);
            wakeupTime.setMinutes(wakeupTime.getMinutes() + nap.duration);
            
            results.push({
                name: nap.name,
                duration: nap.duration,
                wakeup: wakeupTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                description: nap.description
            });
        });

        displayNapResults(
            `For a nap starting at ${napDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}, set your alarm for:`,
            results
        );
    }

    function displayNapResults(title, results) {
        napResultsTitle.textContent = title;
        napResultsList.innerHTML = '';

        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <strong>${result.name} (${result.duration} min):</strong> ${result.wakeup}<br>
                <small>${result.description}</small>
            `;
            napResultsList.appendChild(resultItem);
        });

        napResultsSection.style.display = 'block';
        napResultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Track nap calculation
        if (typeof gtag !== 'undefined') {
            gtag('event', 'calculation', {
                'event_category': 'nap_calculator',
                'event_label': 'nap_times'
            });
        }
    }
});
