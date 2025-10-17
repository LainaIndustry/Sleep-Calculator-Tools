// Sleep Calculators JavaScript

// Sleep Cycle Calculator
function calculateSleepCycles() {
    const bedtime = document.getElementById('bedtime').value;
    const wakeTime = document.getElementById('wakeTime').value;
    
    if (!bedtime || !wakeTime) {
        alert('Please enter both bedtime and wake time');
        return;
    }
    
    // Convert times to Date objects for calculation
    const [bedHours, bedMinutes] = bedtime.split(':').map(Number);
    const [wakeHours, wakeMinutes] = wakeTime.split(':').map(Number);
    
    let bedDate = new Date();
    bedDate.setHours(bedHours, bedMinutes, 0, 0);
    
    let wakeDate = new Date();
    wakeDate.setHours(wakeHours, wakeMinutes, 0, 0);
    
    // If wake time is earlier than bedtime, assume it's the next day
    if (wakeDate <= bedDate) {
        wakeDate.setDate(wakeDate.getDate() + 1);
    }
    
    // Calculate total sleep time in minutes
    const sleepTimeMs = wakeDate - bedDate;
    const sleepTimeMinutes = sleepTimeMs / (1000 * 60);
    const sleepTimeHours = sleepTimeMinutes / 60;
    
    // Calculate sleep cycles (each cycle is ~90 minutes)
    const sleepCycles = Math.round(sleepTimeMinutes / 90);
    
    // Calculate optimal wake times (multiples of 90 minutes from bedtime)
    const optimalTimes = [];
    for (let i = 4; i <= 6; i++) {
        const optimalTime = new Date(bedDate.getTime() + (i * 90 * 60 * 1000));
        optimalTimes.push(optimalTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    }
    
    // Display results
    document.getElementById('cycleCount').textContent = `${sleepCycles} sleep cycles`;
    document.getElementById('optimalTimes').textContent = optimalTimes.join(', ');
    document.getElementById('result').style.display = 'block';
    
    // Add detailed analysis
    const analysis = document.createElement('div');
    analysis.className = 'sleep-analysis';
    analysis.innerHTML = `
        <p><strong>Total Sleep Time:</strong> ${Math.floor(sleepTimeHours)} hours ${Math.round(sleepTimeMinutes % 60)} minutes</p>
        <p><strong>Sleep Quality:</strong> ${sleepCycles >= 5 ? 'Excellent' : sleepCycles >= 4 ? 'Good' : 'Fair'}</p>
    `;
    
    const existingAnalysis = document.querySelector('.sleep-analysis');
    if (existingAnalysis) {
        existingAnalysis.remove();
    }
    
    document.getElementById('result').appendChild(analysis);
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateSleepCycles);
    }
});
