// Initialize global variables
let currentSpeed = 0; // Initial speed
let metersToday = parseFloat(localStorage.getItem('metersToday')) || 0;
let earningsSuspended = false;
let lastLat = null;
let lastLng = null;
let lastTimestamp = null;
const maxSpeed = 9; // Speed limit in m/s
let drivingAlertInterval = null;
let speedUpdateInterval = null;

let map;
let userMarker;

// Initialize the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 }, // Default center, will be updated
        zoom: 15,
    });

    userMarker = new google.maps.Marker({
        map: map,
        position: { lat: 0, lng: 0 }, // Default position, will be updated
        title: 'You are here',
    });
}

// Update the map and speed in real-time when the position changes
function updateTracker(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    const newPosition = { lat: lat, lng: lng };
    map.setCenter(new google.maps.LatLng(lat, lng));
    userMarker.setPosition(newPosition);

    calculateSpeed(lat, lng, position.timestamp);
    document.getElementById('speed-value').textContent = currentSpeed.toFixed(2); // Update speed value

    if (currentSpeed > maxSpeed) {
        if (!earningsSuspended) {
            suspendEarnings();
        }
        if (!drivingAlertInterval) {
            startDrivingAlert();
        }
        showDrivingWarning(); // Show "Driving Warning"
        clearInterval(speedUpdateInterval); // Stop adding metersToday when over speed
    } else {
        if (earningsSuspended) {
            stopDrivingAlert();
            resumeEarnings();
            showAllGood(); // Show "All Good"
        }
        if (!speedUpdateInterval) {
            startSpeedUpdate(); // Start adding metersToday when speed is under limit
        }
    }
}

// Calculate the speed based on location change (using distance and time)
function calculateSpeed(lat, lng, timestamp) {
    if (lastLat !== null && lastLng !== null) {
        const distance = calculateDistance(lastLat, lastLng, lat, lng); // meters
        const timeElapsed = (timestamp - lastTimestamp) / 1000; // seconds
        if (timeElapsed > 0) {
            currentSpeed = distance / timeElapsed; // meters per second
        }
    }
    lastLat = lat;
    lastLng = lng;
    lastTimestamp = timestamp;
}

// Function to start adding metersToday every second if under speed limit
function startSpeedUpdate() {
    speedUpdateInterval = setInterval(() => {
        if (currentSpeed < maxSpeed) {
            metersToday += currentSpeed; // Add current speed to metersToday
            localStorage.setItem('metersToday', metersToday);
            document.getElementById('meters-today').textContent = metersToday.toFixed(2); // Show meters to two decimal places
        }
    }, 1000); // Update every second
}

// Function to apply penalty if speed exceeds limit
function applyPenalty() {
    const penaltyAmount = 0.10 * currentSpeed; // 10% of current speed

    // Deduct the penalty amount from metersToday
    metersToday = Math.max(0, metersToday - penaltyAmount);
    localStorage.setItem('metersToday', metersToday);
    document.getElementById('meters-today').textContent = metersToday.toFixed(2); // Show meters to two decimal places
}

// Function to flash the screen red with a "DRIVING ALERT" message continuously
function startDrivingAlert() {
    if (!document.getElementById('driving-alert')) {
        const alertDiv = document.createElement('div');
        alertDiv.id = 'driving-alert';
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '50%';
        alertDiv.style.left = '50%';
        alertDiv.style.transform = 'translate(-50%, -50%)';
        alertDiv.style.backgroundColor = 'red';
        alertDiv.style.color = 'white';
        alertDiv.style.fontSize = '3rem';
        alertDiv.style.padding = '20px';
        alertDiv.style.borderRadius = '10px';
        alertDiv.textContent = 'DRIVING ALERT';
        alertDiv.style.zIndex = '10000'; // Ensure it's on top
        document.body.appendChild(alertDiv);
    }

    drivingAlertInterval = setInterval(() => {
        const alertDiv = document.getElementById('driving-alert');
        if (currentSpeed > maxSpeed) {
            // Toggle alert visibility
            if (alertDiv.style.visibility === 'hidden') {
                alertDiv.style.visibility = 'visible';
            } else {
                alertDiv.style.visibility = 'hidden';
            }
            applyContinuousPenalty();
        } else {
            clearInterval(drivingAlertInterval);
            alertDiv.remove();
            drivingAlertInterval = null;
        }
    }, 1000); // 1-second interval
}

// Function to apply continuous penalty
function applyContinuousPenalty() {
    const penaltyAmount = 0.10 * currentSpeed; // 10% of current speed

    // Deduct the penalty amount from metersToday
    metersToday = Math.max(0, metersToday - penaltyAmount);
    localStorage.setItem('metersToday', metersToday);
    document.getElementById('meters-today').textContent = metersToday.toFixed(2); // Show meters to two decimal places
}

// Function to stop the driving alert
function stopDrivingAlert() {
    const alertDiv = document.getElementById('driving-alert');
    if (alertDiv) {
        alertDiv.remove();
    }
    if (drivingAlertInterval) {
        clearInterval(drivingAlertInterval);
        drivingAlertInterval = null;
    }
}

// Function to suspend earnings when speed exceeds limit
function suspendEarnings() {
    earningsSuspended = true;
    localStorage.setItem('earningsSuspended', 'true');
    clearInterval(speedUpdateInterval); // Stop updating metersToday
}

// Function to resume earnings when speed goes back under limit
function resumeEarnings() {
    earningsSuspended = false;
    localStorage.setItem('earningsSuspended', 'false');
    if (!speedUpdateInterval) {
        startSpeedUpdate(); // Restart updating metersToday
    }
}

// Function to calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon1 - lon2) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
}

// Function to watch position updates
function watchPosition() {
    navigator.geolocation.watchPosition(position => {
        updateTracker(position);
    }, (error) => {
        console.error(error);
    }, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
    });
}

// Function to display "Driving Warning" when speed exceeds limit
function showDrivingWarning() {
    const statusElement = document.getElementById('status-symbol');
    statusElement.innerHTML = '🚨 Driving Warning!';
    statusElement.style.color = 'red';
}

// Function to display "All Good" when speed is within limit
function showAllGood() {
    const statusElement = document.getElementById('status-symbol');
    statusElement.innerHTML = '✅ All Good';
    statusElement.style.color = 'green';
}

// Function to initialize the 24-hour timer in localStorage
function initializeTimer() {
    const totalDuration = 86400; // 24 hours in seconds
    if (!localStorage.getItem('resetTimerStart')) {
        const now = Date.now();
        localStorage.setItem('resetTimerStart', now); // Store the start time
        localStorage.setItem('resetTimerDuration', totalDuration); // Store the total duration
    }
}

// Function to get the remaining time in seconds
function getRemainingTime() {
    const startTime = parseInt(localStorage.getItem('resetTimerStart'), 10);
    const totalDuration = parseInt(localStorage.getItem('resetTimerDuration'), 10);
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    return totalDuration - elapsedSeconds;
}

// Function to convert seconds to HH:MM:SS format
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours} hours, ${minutes} minutes, and ${secs} seconds`;
}

// Function to update the reset timer
function updateResetTimer() {
    let remainingSeconds = getRemainingTime();

    if (remainingSeconds <= 0) {
        remainingSeconds = 86400; // Reset to 24 hours
        const now = Date.now();
        localStorage.setItem('resetTimerStart', now); // Reset the start time
        localStorage.setItem('resetTimerDuration', remainingSeconds);

        // Perform the reset operation here, like converting meters to EcoPoints
        convertMetersToEcoPoints();
    }

    // Update the displayed time
    document.getElementById('reset-info').textContent = `*Your meters will convert to EcoPoints in ${formatTime(remainingSeconds)}`;
}

// Function to convert meters to EcoPoints and reset meters and penalty
function convertMetersToEcoPoints() {
    const metersToday = parseFloat(localStorage.getItem('metersToday')) || 0;
    const penalty = parseFloat(localStorage.getItem('penalty')) || 0;
    const netMeters = metersToday - penalty;
    const ecoPoints = Math.floor(netMeters / 10);

    const coinAmount = parseFloat(localStorage.getItem('coinAmount')) || 0;
    localStorage.setItem('coinAmount', coinAmount + ecoPoints);

    localStorage.setItem('metersToday', 0); // Reset metersToday
    localStorage.setItem('penalty', 0); // Reset penalty
    document.getElementById('meters-today').textContent = '0';
}

// Reset earnings timer and resume earning when going online
window.addEventListener('online', () => {
    resumeEarnings();
});

document.addEventListener('DOMContentLoaded', () => {
    initializeTimer();
    updateResetTimer();
    initMap(); // Initialize the map
    watchPosition();
    setInterval(updateResetTimer, 1000); // Update the reset timer every second
});
