class SleepCalculator {
    constructor() {
        this.calculationType = document.getElementById('calculation-type');
        this.wakeTimeGroup = document.getElementById('wake-time-group');
        this.bedTimeGroup = document.getElementById('bed-time-group');
        this.wakeTimeInput = document.getElementById('wake-time');
        this.bedTimeInput = document.getElementById('bed-time');
        this.fallAsleepInput = document.getElementById('fall-asleep-time');
        this.calculateBtn = document.getElementById('calculate-btn');
        this.resultsSection = document.getElementById('results-section');
        this.resultsGrid = document.getElementById('results-grid');

        this.init();
    }

    init() {
        this.calculationType.addEventListener('change', () => this.toggleInputs());
        this.calculateBtn.addEventListener('click', () => this.calculate());
        
        // Calculate on enter key
        [this.wakeTimeInput, this.bedTimeInput, this.fallAsleepInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.calculate();
            });
        });
    }

    toggleInputs() {
        const type = this.calculationType.value;
        if (type === 'bedtime') {
            this.wakeTimeGroup.style.display = 'block';
            this.bedTimeGroup.style.display = 'none';
        } else {
            this.wakeTimeGroup.style.display = 'none';
            this.bedTimeGroup.style.display = 'block';
        }
    }

    calculate() {
        const type = this.calculationType.value;
        const fallAsleepTime = parseInt(this.fallAsleepInput.value);
        
        let baseTime;
        if (type === 'bedtime') {
            baseTime = this.wakeTimeInput.value;
        } else {
            baseTime = this.bedTimeInput.value;
        }

        if (!baseTime) {
            alert('Please enter a valid time');
            return;
        }

        const results = this.calculateSleepTimes(baseTime, fallAsleepTime, type);
        this.displayResults(results, type);
    }

    calculateSleepTimes(baseTime, fallAsleepTime, type) {
        const baseDate = new Date(`2000-01-01T${baseTime}`);
        const results = [];
        const sleepCycleDuration = 90; // 90 minutes per sleep cycle

        // Calculate times for 4 to 7 sleep cycles (6 to 10.5 hours)
        for (let cycles = 4; cycles <= 7; cycles++) {
            const totalSleepMinutes = (cycles * sleepCycleDuration) + fallAsleepTime;
            let targetTime;

            if (type === 'bedtime') {
                // Calculate bedtime based on wake-up time
                targetTime = new Date(baseDate.getTime() - (totalSleepMinutes * 60000));
            } else {
                // Calculate wake-up time based on bedtime
                targetTime = new Date(baseDate.getTime() + (totalSleepMinutes * 60000));
            }

            results.push({
                cycles: cycles,
                time: this.formatTime(targetTime),
                totalHours: (totalSleepMinutes / 60).toFixed(1),
                isRecommended: cycles === 6 // 6 cycles (9 hours) is often recommended
            });
        }

        return results;
    }

    formatTime(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const period = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        return `${hours}:${minutes} ${period}`;
    }

    displayResults(results, type) {
        this.resultsGrid.innerHTML = '';
        
        results.forEach(result => {
            const option = document.createElement('div');
            option.className = `sleep-time-option ${result.isRecommended ? 'recommended' : ''}`;
            option.innerHTML = `
                <div class="cycles">${result.cycles} sleep cycles</div>
                <div class="time">${result.time}</div>
                <div class="hours">${result.totalHours} hours total</div>
                ${result.isRecommended ? '<div class="recommended-badge">Recommended</div>' : ''}
            `;
            this.resultsGrid.appendChild(option);
        });

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
    new SleepCalculator();
});
