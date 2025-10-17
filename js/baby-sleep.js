class BabySleepCalculator {
    constructor() {
        this.babyAgeSelect = document.getElementById('baby-age');
        this.wakeTimeInput = document.getElementById('wake-time');
        this.currentSleepSelect = document.getElementById('current-sleep');
        this.calculateBtn = document.getElementById('calculate-btn');
        this.resultsSection = document.getElementById('results-section');
        this.scheduleInfo = document.getElementById('schedule-info');
        this.scheduleTimeline = document.getElementById('schedule-timeline');
        this.ageTips = document.getElementById('age-tips');

        this.ageData = {
            newborn: {
                totalSleep: '14-17 hours',
                nightSleep: '8-9 hours',
                naps: '3-5 naps',
                wakeWindow: '45-60 minutes',
                tips: [
                    'Follow sleepy cues rather than strict schedules',
                    'Swaddling can help newborns feel secure',
                    'White noise mimics womb environment',
                    'Feed on demand, including overnight'
                ]
            },
            infant: {
                totalSleep: '12-15 hours',
                nightSleep: '10-12 hours',
                naps: '2-3 naps',
                wakeWindow: '2-3 hours',
                tips: [
                    'Establish consistent bedtime routine',
                    'Introduce dream feed if needed',
                    'Practice putting down drowsy but awake',
                    'Nap environment should be dark and quiet'
                ]
            },
            toddler: {
                totalSleep: '11-14 hours',
                nightSleep: '10-12 hours',
                naps: '1-2 naps',
                wakeWindow: '4-6 hours',
                tips: [
                    'Maintain consistent sleep and wake times',
                    'Transition to one nap typically around 15-18 months',
                    'Use toddler bed when climbing out of crib',
                    'Limit screen time before bed'
                ]
            },
            preschooler: {
                totalSleep: '10-13 hours',
                nightSleep: '10-12 hours',
                naps: '0-1 nap',
                wakeWindow: '6-12 hours',
                tips: [
                    'Establish relaxing bedtime routine',
                    'Use night lights if afraid of dark',
                    'Keep consistent weekend schedule',
                    'Address nightmares with reassurance'
                ]
            }
        };

        this.init();
    }

    init() {
        this.calculateBtn.addEventListener('click', () => this.calculate());
        
        // Set default wake time
        this.wakeTimeInput.value = '07:00';

        // Calculate on enter key
        [this.babyAgeSelect, this.wakeTimeInput, this.currentSleepSelect].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.calculate();
            });
        });
    }

    calculate() {
        const age = this.babyAgeSelect.value;
        const wakeTime = this.wakeTimeInput.value;
        const currentSleep = this.currentSleepSelect.value;

        if (!wakeTime) {
            alert('Please enter a wake-up time');
            return;
        }

        const schedule = this.generateSchedule(age, wakeTime, currentSleep);
        this.displayResults(schedule, age);
    }

    generateSchedule(age, wakeTime, currentSleep) {
        const wakeDate = new Date(`2000-01-01T${wakeTime}`);
        const schedule = [];
        const ageData = this.ageData[age];

        let currentTime = new Date(wakeDate.getTime());

        // Morning routine
        schedule.push({
            time: this.formatTime(currentTime),
            activity: 'Wake up & morning feeding',
            duration: '30 min',
            type: 'feeding'
        });

        // Calculate nap and activity schedule based on age
        switch(age) {
            case 'newborn':
                this.generateNewbornSchedule(schedule, currentTime);
                break;
            case 'infant':
                this.generateInfantSchedule(schedule, currentTime);
                break;
            case 'toddler':
                this.generateToddlerSchedule(schedule, currentTime);
                break;
            case 'preschooler':
                this.generatePreschoolerSchedule(schedule, currentTime);
                break;
        }

        // Bedtime routine
        const bedtime = this.calculateBedtime(age, wakeDate);
        schedule.push({
            time: this.formatTime(new Date(bedtime.getTime() - (30 * 60000))),
            activity: 'Bedtime routine (bath, story, feeding)',
            duration: '30 min',
            type: 'night-sleep'
        });

        schedule.push({
            time: this.formatTime(bedtime),
            activity: 'Bedtime',
            duration: ageData.nightSleep,
            type: 'night-sleep'
        });

        return {
            schedule: schedule,
            summary: ageData
        };
    }

    generateNewbornSchedule(schedule, startTime) {
        let currentTime = new Date(startTime.getTime());
        
        // Newborns have short wake windows and frequent naps
        for (let i = 0; i < 4; i++) {
            // Activity time (45-60 minutes)
            currentTime = new Date(currentTime.getTime() + (45 * 60000));
            schedule.push({
                time: this.formatTime(currentTime),
                activity: 'Tummy time & play',
                duration: '15 min',
                type: 'activity'
            });

            // Nap time (1-2 hours)
            currentTime = new Date(currentTime.getTime() + (15 * 60000));
            const napDuration = 60 + (Math.random() * 60); // 60-120 minutes
            schedule.push({
                time: this.formatTime(currentTime),
                activity: 'Nap',
                duration: `${Math.round(napDuration)} min`,
                type: 'nap'
            });

            // Feeding after nap
            currentTime = new Date(currentTime.getTime() + (napDuration * 60000));
            schedule.push({
                time: this.formatTime(currentTime),
                activity: 'Feeding',
                duration: '30 min',
                type: 'feeding'
            });
        }
    }

    generateInfantSchedule(schedule, startTime) {
        let currentTime = new Date(startTime.getTime() + (30 * 60000)); // After morning routine
        
        // Morning nap
        currentTime = new Date(currentTime.getTime() + (2 * 60 * 60000)); // 2 hours after wake up
        schedule.push({
            time: this.formatTime(currentTime),
            activity: 'Morning nap',
            duration: '1-2 hours',
            type: 'nap'
        });

        // Lunch and afternoon activity
        currentTime = new Date(currentTime.getTime() + (90 * 60000)); // 1.5 hour nap
        schedule.push({
            time: this.formatTime(currentTime),
            activity: 'Lunch & play',
            duration: '2 hours',
            type: 'activity'
        });

        // Afternoon nap
        currentTime = new Date(currentTime.getTime() + (2 * 60 * 60000));
        schedule.push({
            time: this.formatTime(currentTime),
            activity: 'Afternoon nap',
            duration: '1-2 hours',
            type: 'nap'
        });

        // Evening routine
        currentTime = new Date(currentTime.getTime() + (90 * 60000));
        schedule.push({
            time: this.formatTime(currentTime),
            activity: 'Dinner & quiet play',
            duration: '2 hours',
            type: 'activity'
        });
    }

    generateToddlerSchedule(schedule, startTime) {
        let currentTime = new Date(startTime.getTime() + (30 * 60000));
        
        // Morning activity
        schedule.push({
            time: this.formatTime(new Date(currentTime.getTime() + (3 * 60 * 60000))),
            activity: 'Lunch',
            duration: '1 hour',
            type: 'feeding'
        });

        // Afternoon nap
        currentTime = new Date(currentTime.getTime() + (4 * 60 * 60000));
        schedule.push({
            time: this.formatTime(currentTime),
            activity: 'Afternoon nap',
            duration: '2-3 hours',
            type: 'nap'
        });

        // Afternoon activity
        currentTime = new Date(currentTime.getTime() + (150 * 60000)); // 2.5 hour nap
        schedule.push({
            time: this.formatTime(currentTime),
            activity: 'Snack & outdoor play',
            duration: '2 hours',
            type: 'activity'
        });
    }

    generatePreschoolerSchedule(schedule, startTime) {
        let currentTime = new Date(startTime.getTime() + (30 * 60000));
        
        // Full day of activities (optional nap)
        schedule.push({
            time: this.formatTime(new Date(currentTime.getTime() + (5 * 60 * 60000))),
            activity: 'Lunch & quiet time',
            duration: '2 hours',
            type: 'activity'
        });

        // Optional rest time
        currentTime = new Date(currentTime.getTime() + (7 * 60 * 60000));
        schedule.push({
            time: this.formatTime(currentTime),
            activity: 'Quiet time / Optional nap',
            duration: '1 hour',
            type: 'nap'
        });
    }

    calculateBedtime(age, wakeTime) {
        const bedtimes = {
            newborn: 20, // 8 PM
            infant: 19,  // 7 PM
            toddler: 19, // 7 PM
            preschooler: 20 // 8 PM
        };

        const bedtimeHour = bedtimes[age];
        return new Date(wakeTime.getTime() + (bedtimeHour * 60 * 60000));
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

    displayResults(scheduleData, age) {
        this.displayScheduleInfo(scheduleData.summary);
        this.displayTimeline(scheduleData.schedule);
        this.displayAgeTips(age);
        
        this.resultsSection.style.display = 'block';
        
        // Scroll to results
        this.resultsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }

    displayScheduleInfo(summary) {
        this.scheduleInfo.innerHTML = `
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-value">${summary.totalSleep}</div>
                    <div class="info-label">Total Sleep</div>
                </div>
                <div class="info-item">
                    <div class="info-value">${summary.nightSleep}</div>
                    <div class="info-label">Night Sleep</div>
                </div>
                <div class="info-item">
                    <div class="info-value">${summary.naps}</div>
                    <div class="info-label">Daily Naps</div>
                </div>
                <div class="info-item">
                    <div class="info-value">${summary.wakeWindow}</div>
                    <div class="info-label">Wake Window</div>
                </div>
            </div>
        `;
    }

    displayTimeline(schedule) {
        this.scheduleTimeline.innerHTML = '';
        
        schedule.forEach(item => {
            const timelineItem = document.createElement('div');
            timelineItem.className = `timeline-item ${item.type}`;
            timelineItem.innerHTML = `
                <div class="timeline-time">${item.time}</div>
                <div class="timeline-activity">${item.activity}</div>
                <div class="timeline-duration">${item.duration}</div>
            `;
            this.scheduleTimeline.appendChild(timelineItem);
        });
    }

    displayAgeTips(age) {
        const tips = this.ageData[age].tips;
        this.ageTips.innerHTML = '';
        
        tips.forEach(tip => {
            const tipElement = document.createElement('div');
            tipElement.className = 'age-tip';
            tipElement.innerHTML = `
                <p>${tip}</p>
            `;
            this.ageTips.appendChild(tipElement);
        });
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BabySleepCalculator();
});
