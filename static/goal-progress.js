
const selectedGoal = parseInt(localStorage.getItem('selectedGoal')) || 300;
document.getElementById('goal-value').textContent = selectedGoal;


const coinAmount = parseInt(localStorage.getItem('coinAmount')) || 0;


const progressPercentage = Math.min((coinAmount / selectedGoal) * 100, 100); 


document.getElementById('progress').style.width = `${progressPercentage}%`;
document.getElementById('progress-text').textContent = `You have ${coinAmount} out of ${selectedGoal} coins (${Math.round(progressPercentage)}%)`;


const ctx = document.getElementById('goalChart').getContext('2d');
const goalChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Trash Camera', 'Meters'],
        datasets: [{
            data: [33.3, 33.3], 
            backgroundColor: ['#81C784', '#AED581'],
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            }
        }
    }
});

function playClickSound() {
    const isSoundOn = localStorage.getItem('soundToggle') === 'on'; 
    if (isSoundOn) {
        const clickSound = new Audio('click.mp3');
        clickSound.play();
    }
}


function attachClickSound() {

    const clickableElements = document.querySelectorAll(
        'button, a, input[type="checkbox"], input[type="radio"], .toggle, .clickable, .bottom-nav .nav-item, li, i'
    );

    clickableElements.forEach(element => {
        element.addEventListener('click', playClickSound);
    });
}


function handleSoundToggleChange() {
    const soundToggle = document.getElementById('sound-toggle'); 
    soundToggle.addEventListener('change', () => {
        const isOn = soundToggle.checked; 
        localStorage.setItem('soundToggle', isOn ? 'on' : 'off');
    });
}


document.addEventListener('DOMContentLoaded', () => {
    attachClickSound();
    handleSoundToggleChange();
});
