let lastPosition = null;
let totalDistance = 0;
let metersToday = parseFloat(localStorage.getItem('metersToday')) || 0;

// Function to calculate the distance between two coordinates
function calculateDistance(coord1, coord2) {
    const R = 6371e3; // Earth's radius in meters
    const lat1 = coord1.lat * Math.PI / 180;
    const lat2 = coord2.lat * Math.PI / 180;
    const deltaLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const deltaLng = (coord2.lng - coord1.lng) * Math.PI / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;  // Distance in meters
}

// Function to save and update location
function updateLocation(position) {
    const currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    if (lastPosition) {
        const distance = calculateDistance(lastPosition, currentPosition);
        totalDistance += distance;
        document.getElementById('distance-traveled').textContent = `Distance Traveled: ${totalDistance.toFixed(2)} meters`;

        // Every 50 meters, update metersToday
        if (totalDistance >= 50) {
            metersToday += 50;
            totalDistance -= 50;
            localStorage.setItem('metersToday', metersToday);
            document.getElementById('meters-today').textContent = metersToday.toFixed(1);
        }
    }

    lastPosition = currentPosition;
}

// Start tracking location in the background
function startLocationTracking() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(updateLocation, (error) => {
            console.error("Error getting location: ", error);
        }, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// Show the map when the meters today button is clicked
document.getElementById('meters-today').addEventListener('click', () => {
    console.log("Meters Today button clicked.");
    const mapContainer = document.getElementById('map-container');
    mapContainer.style.display = 'block'; // Ensure the map is visible
    mapContainer.scrollIntoView({ behavior: 'smooth' }); // Scroll into view smoothly
});

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', () => {
    startLocationTracking();
});
