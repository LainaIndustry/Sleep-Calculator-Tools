// Sleep Calculator Functionality
document.addEventListener('DOMContentLoaded', function() {
    const calculateBedtimeBtn = document.getElementById('calculate-bedtime');
    const calculateWakeupBtn = document.getElementById('calculate-wakeup');
    const resultsSection = document.getElementById('results');
    const resultsTitle = document.getElementById('results-title');
    const resultsList = document.getElementById('results-list');

    // Calculate bedtime based on wake-up time
    if (calculateBedtimeBtn) {
        calculateBedtimeBtn.addEventListener('click', function() {
            const wakeupTime = document.getElementById('wakeup-time').value;
            calculateBedtime(wakeupTime);
        });
    }

    // Calculate wake-up time based on current time
    if (calculateWakeupBtn) {
        calculateWakeupBtn.addEventListener('click', function() {
            calculateWakeupTime();
        });
    }

    function calculateBedtime(wakeupTime) {
        if (!wakeupTime) {
            alert('Please enter a wake-up time');
            return;
        }

        const [hours, minutes] = wakeupTime.split(':').map(Number);
        const wakeupDate = new Date();
        wakeupDate.setHours(hours, minutes, 0, 0);

        // If wake-up time is earlier than current time, assume it's for tomorrow
        if (wakeupDate < new Date()) {
            wakeupDate.setDate(wakeupDate.getDate() + 1);
        }

        const fallAsleepTime = 15; // minutes to fall asleep
        const cycleDuration = 90; // minutes per sleep cycle
        const results = [];

        // Calculate bedtimes for 4-7 sleep cycles (6-10.5 hours of sleep)
        for (let cycles = 4; cycles <= 7; cycles++) {
            const bedtime = new Date(wakeupDate);
            bedtime.setMinutes(bedtime.getMinutes() - (cycles * cycleDuration) - fallAsleepTime);
            
            results.push({
                cycles: cycles,
                time: bedtime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                hours: (cycles * cycleDuration / 60).toFixed(1)
            });
        }

        displayResults(
            `To wake up at ${wakeupDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}, you should go to sleep at one of the following times:`,
            results,
            'bedtime'
        );
    }

    function calculateWakeupTime() {
        const now = new Date();
        const fallAsleepTime = 15; // minutes to fall asleep
        const cycleDuration = 90; // minutes per sleep cycle
        const results = [];

        // Calculate wake-up times for 4-7 sleep cycles
        for (let cycles = 4; cycles <= 7; cycles++) {
            const wakeupTime = new Date(now);
            wakeupTime.setMinutes(wakeupTime.getMinutes() + fallAsleepTime + (cycles * cycleDuration));
            
            results.push({
                cycles: cycles,
                time: wakeupTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                hours: (cycles * cycleDuration / 60).toFixed(1)
            });
        }

        displayResults(
            `If you go to bed now, you should wake up at one of the following times:`,
            results,
            'wakeup'
        );
    }

    function displayResults(title, results, type) {
        resultsTitle.textContent = title;
        resultsList.innerHTML = '';

        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <span class="cycles">${result.cycles} cycles (${result.hours} hours):</span>
                ${result.time}
            `;
            resultsList.appendChild(resultItem);
        });

        resultsSection.style.display = 'block';
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Track calculation event
        trackCalculation(type);
    }

    function trackCalculation(type) {
        // Google Analytics event tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'calculation', {
                'event_category': 'sleep_calculator',
                'event_label': type
            });
        }
    }
});
