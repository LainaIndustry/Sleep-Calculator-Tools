class NapCalculator {
    constructor() {
        this.wakeTimeInput = document.getElementById('wake-time');
        this.bedtimeInput = document.getElementById('bedtime');
        this.energyLevelSelect = document.getElementById('energy-level');
        this.calculateBtn = document.getElementById('calculate-btn');
        this.resultsSection = document.getElementById('results-section');
        this.napOptions = document.getElementById('nap-options');

        this.napTypes = [
            {
                type: 'Power Nap',
                duration: 20,
                description: 'Quick energy boost',
                benefits: 'Improves alertness & performance'
            },
            {
                type: 'Short Nap',
                duration: 30,
                description: 'Cognitive refresh',
                benefits: 'Enhances memory & learning'
            },
            {
                type: 'Full Cycle Nap',
                duration: 90,
                description: 'Complete rest',
                benefits: 'Boosts creativity & emotional health'
            },
            {
                type: 'Emergency Nap',
                duration: 60,
                description: 'Deep recovery',
                benefits: 'For severe sleep deprivation'
            }
        ];

        this.init();
    }

    init() {
        this.calculateBtn.addEventListener('click', () => this.calculate());
        
        // Set default times
        const now = new Date();
        this.wakeTimeInput.value = this.formatTimeForInput(new Date(now.setHours(7, 0, 0, 0)));
        this.bedtimeInput.value = this.formatTimeForInput(new Date(now.setHours(23, 0, 0, 0)));

        // Calculate on enter key
        [this.wakeTimeInput, this.bedtimeInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.calculate();
            });
        });
    }

    formatTimeForInput(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    calculate() {
        const wakeTime = this.wakeTimeInput.value;
        const bedtime = this.bedtimeInput.value;
        const energyLevel = this.energyLevelSelect.value;

        if (!wakeTime || !bedtime) {
            alert('Please enter both wake time and bedtime');
            return;
        }

        const results = this.calculateNapTimes(wakeTime, bedtime, energyLevel);
        this.displayResults(results);
    }

    calculateNapTimes(wakeTime, bedtime, energyLevel) {
        const wakeDate = new Date(`2000-01-01T${wakeTime}`);
        const bedDate = new Date(`2000-01-01T${bedtime}`);
        const now = new Date();
        const currentTime = new Date(`2000-01-01T${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);

        const results = [];
        const recommendedIndex = this.getRecommendedNapIndex(energyLevel);

        this.napTypes.forEach((napType, index) => {
            // Calculate ideal nap time (typically 7-9 hours after waking)
            let idealNapTime = new Date(wakeDate.getTime() + (8 * 60 * 60000)); // 8 hours after waking
            
            // Adjust based on energy level
            if (energyLevel === 'high') {
                idealNapTime = new Date(wakeDate.getTime() + (6 * 60 * 60000)); // Earlier for high energy
            } else if (energyLevel === 'exhausted') {
                idealNapTime = new Date(wakeDate.getTime() + (5 * 60 * 60000)); // Even earlier if exhausted
            }

            // Ensure nap doesn't interfere with bedtime (stop napping 4 hours before bed)
            const latestNapTime = new Date(bedDate.getTime() - (4 * 60 * 60000));
            
            if (idealNapTime > latestNapTime) {
                idealNapTime = latestNapTime;
            }

            // If current time is after ideal nap time, suggest immediate nap
            if (currentTime > idealNapTime) {
                idealNapTime = new Date(currentTime.getTime() + (30 * 60000)); // 30 minutes from now
            }

            const napEndTime = new Date(idealNapTime.getTime() + (napType.duration * 60000));

            // Check if nap would interfere with bedtime
            if (napEndTime < bedDate) {
                results.push({
                    ...napType,
                    startTime: this.formatTime(idealNapTime),
                    endTime: this.formatTime(napEndTime),
                    isRecommended: index === recommendedIndex
                });
            }
        });

        return results;
    }

    getRecommendedNapIndex(energyLevel) {
        switch(energyLevel) {
            case 'high':
                return 0; // Power Nap
            case 'medium':
                return 1; // Short Nap
            case 'low':
                return 2; // Full Cycle
            case 'exhausted':
                return 3; // Emergency Nap
            default:
                return 1;
        }
    }

    formatTime(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const period = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        return `${hours}:${minutes} ${period}`;
    }

    displayResults(results) {
        this.napOptions.innerHTML = '';
        
        if (results.length === 0) {
            this.napOptions.innerHTML = `
                <div class="no-nap-message">
                    <h4>No Recommended Naps</h4>
                    <p>It's too close to your bedtime for napping. Try to stay awake until your scheduled bedtime.</p>
                </div>
            `;
        } else {
            results.forEach((result, index) => {
                const option = document.createElement('div');
                option.className = `nap-option ${result.isRecommended ? 'recommended' : ''}`;
                option.innerHTML = `
                    <div class="nap-type">${result.type}</div>
                    <div class="nap-duration">${result.duration} minutes</div>
                    <div class="nap-time">${result.startTime} - ${result.endTime}</div>
                    <div class="nap-benefits">${result.benefits}</div>
                    <div class="nap-description">${result.description}</div>
                    ${result.isRecommended ? '<div class="recommended-badge">Recommended for you</div>' : ''}
                `;
                this.napOptions.appendChild(option);
            });
        }

        this.resultsSection.style.display = 'block';
        
        // Scroll to results
        this.resultsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NapCalculator();
});
