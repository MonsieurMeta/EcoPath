// Function to set the selected goal in localStorage and navigate to the progress page
function setGoal(goalValue) {
    localStorage.setItem('selectedGoal', goalValue);
    window.location.href = 'goal-progress.html'; // Redirect to the goal progress page
}

// Attach event listeners to the goal buttons
document.querySelectorAll('.goal-button').forEach(button => {
    button.addEventListener('click', () => {
        const goalValue = button.textContent;
        setGoal(goalValue);
    });
});

// Attach event listener to the custom goal input
document.querySelector('.custom-goal').addEventListener('change', function() {
    const customGoalValue = this.value;
    if (customGoalValue) {
        setGoal(customGoalValue);
    }
});
// Check if a selected goal is already set in localStorage
const selectedGoal = localStorage.getItem('selectedGoal');
if (selectedGoal) {
    // Redirect to goal-progress.html if a goal is already set
    window.location.href = 'goal-progress.html';
}

// Function to set the selected goal in localStorage and navigate to the progress page
function setGoal(goalValue) {
    localStorage.setItem('selectedGoal', goalValue);
    window.location.href = 'goal-progress.html'; // Redirect to the goal progress page
}

// Attach event listeners to the goal buttons
document.querySelectorAll('.goal-button').forEach(button => {
    button.addEventListener('click', () => {
        const goalValue = button.textContent;
        setGoal(goalValue);
    });
});

// Attach event listener to the custom goal input
document.querySelector('.custom-goal').addEventListener('change', function() {
    const customGoalValue = this.value;
    if (customGoalValue) {
        setGoal(customGoalValue);
    }
});
// Function to play click sound
function playClickSound() {
    const isSoundOn = localStorage.getItem('soundToggle') === 'on'; // Check the sound toggle state
    if (isSoundOn) {
        const clickSound = new Audio('click.mp3');
        clickSound.play();
    }
}

// Function to attach the click sound to all clickable elements
function attachClickSound() {
    // Select all clickable elements, including <li> items, <i> elements, and more
    const clickableElements = document.querySelectorAll(
        'button, a, input[type="checkbox"], input[type="radio"], .toggle, .clickable, .bottom-nav .nav-item, li, i'
    );

    clickableElements.forEach(element => {
        element.addEventListener('click', playClickSound);
    });
}

// Save the sound toggle state to localStorage when it's changed
function handleSoundToggleChange() {
    const soundToggle = document.getElementById('sound-toggle'); // Assuming you have an element with this ID
    soundToggle.addEventListener('change', () => {
        const isOn = soundToggle.checked; // Check if the toggle is on
        localStorage.setItem('soundToggle', isOn ? 'on' : 'off');
    });
}

// Call the functions on page load
document.addEventListener('DOMContentLoaded', () => {
    attachClickSound();
    handleSoundToggleChange();
});
