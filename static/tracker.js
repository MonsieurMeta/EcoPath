// Function to convert seconds to HH:MM:SS format
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours} hours, ${minutes} minutes, and ${secs} seconds`;
}

// Function to initialize the timer if it's not already initialized
function initializeTimer() {
    if (!localStorage.getItem('startTime')) {
        const startTime = Date.now();
        localStorage.setItem('startTime', startTime);
    }
}

// Function to update the reset timer
function updateResetTimer() {
    const startTime = parseInt(localStorage.getItem('startTime'), 10);
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    const totalDuration = 86400; // 24 hours in seconds
    let timeLeft = totalDuration - elapsedSeconds;

    if (timeLeft <= 0) {
        timeLeft = totalDuration; // Reset to 24 hours
        localStorage.setItem('startTime', Date.now()); // Restart timer

        // Perform the reset operation here, like converting meters to EcoPoints
        convertMetersToEcoPoints();
    }

    // Update the displayed time
    document.getElementById('reset-info').textContent = `Your meters will reset in ${formatTime(timeLeft)}`;
}

// Function to convert meters to EcoPoints and reset meters and penalty
function convertMetersToEcoPoints() {
    const metersToday = parseFloat(localStorage.getItem('metersToday')) || 0;
    const penalty = parseFloat(localStorage.getItem('penalty')) || 0;
    const netMeters = metersToday - penalty;
    const ecoPoints = Math.floor(netMeters / 10);

    const coinAmount = parseFloat(localStorage.getItem('coinAmount')) || 0;
    localStorage.setItem('coinAmount', coinAmount + ecoPoints);
    
    localStorage.setItem('metersToday', 0);  // Reset metersToday
    localStorage.setItem('penalty', 0);  // Reset penalty
    document.getElementById('meters-today').textContent = '0';

    // Save today's net meters into localStorage for graph update
    localStorage.setItem('dayBeforeYesterday', localStorage.getItem('yesterday'));
    localStorage.setItem('yesterday', localStorage.getItem('today'));
    localStorage.setItem('today', netMeters);
    updateChartData();

    // Reset the chart data
    activityChart.data.datasets.forEach(dataset => dataset.data[2] = 0);
    activityChart.update();
}

// Function to calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2 - lat1) * Math.PI/180;
    const Δλ = (lon2 - lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in meters
}

// Function to update the meters today based on location change
function updateMetersToday(lat, lng, speed) {
    if (lastLat !== null && lastLng !== null) {
        const distance = calculateDistance(lastLat, lastLng, lat, lng);
        metersToday += distance;  // Update meters based on distance
    }

    if (speed >= 9) {
        penalty += speed; // Add speed to penalty if speed is 9 m/s or more
    }

    localStorage.setItem('metersToday', metersToday);  // Save updated value to localStorage
    localStorage.setItem('penalty', penalty);  // Save updated penalty value to localStorage
    document.getElementById('meters-today').textContent = metersToday.toFixed(1);

    // Update last known location
    lastLat = lat;
    lastLng = lng;
}

// Update the chart data at the end of the day based on metersToday - penalty
function updateChartData(netMeters = metersToday - penalty) {
    activityChart.data.datasets[0].data[2] = netMeters;
    activityChart.update();
}

// Function to calculate speed and update meters and chart
function updateTracker(position) {
    if (position.coords.speed !== null) {
        currentSpeed = position.coords.speed;
        updateMetersToday(position.coords.latitude, position.coords.longitude, currentSpeed);
        displayMode();
        updateChartData();
    }
}

// Function to get the device's location and update speed
function watchPosition() {
    navigator.geolocation.watchPosition(updateTracker, (error) => {
        console.error(error);
    }, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
    });
}

// Initialize the tracker on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTimer();
    displayMode();
    updateChartData();
    watchPosition();
    updateResetTimer();

    // Update the timer every second
    setInterval(updateResetTimer, 1000);
});

const ctx = document.getElementById('activityChart').getContext('2d');
const activityChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [
            new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            'Today'
        ],
        datasets: [
            {
                label: 'Net Meters',
                data: [
                    parseFloat(localStorage.getItem('dayBeforeYesterday')) || 0,
                    parseFloat(localStorage.getItem('yesterday')) || 0,
                    parseFloat(localStorage.getItem('today')) || 0
                ],
                backgroundColor: '#87CEEB'
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                display: false  // Hide legends
            }
        }
    }
});

let currentSpeed = 0; // Initial speed
let metersToday = parseFloat(localStorage.getItem('metersToday')) || 0;
let penalty = parseFloat(localStorage.getItem('penalty')) || 0;
let lastLat = null;
let lastLng = null;

// Function to determine the current mode based on speed
function determineMode(speed) {
    if (speed <= 2) {
        return "Stationary";
    } else if (speed > 2 && speed <= 12) {
        return "Walking";
    } else if (speed > 12 && speed <= 25) {
        return "Biking";
    } else {
        return "Car";
    }
}

// Function to display the current mode and speed
function displayMode() {
    const mode = determineMode(currentSpeed);
    document.getElementById('speed-value').textContent = currentSpeed.toFixed(1);
    document.getElementById('mode-value').textContent = mode;
}
