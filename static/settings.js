
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

    
    const savedState = localStorage.getItem('soundToggle');
    soundToggle.checked = savedState === 'on';

    soundToggle.addEventListener('change', () => {
        const isOn = soundToggle.checked; 
        localStorage.setItem('soundToggle', isOn ? 'on' : 'off');
    });
}


function loadSoundToggleState() {
    const soundToggle = document.getElementById('sound-toggle');
    const savedState = localStorage.getItem('soundToggle');
    soundToggle.checked = savedState === 'on';
}


function initializeSettings() {
    loadSoundToggleState();
    handleSoundToggleChange();
    attachClickSound();
}


document.addEventListener('DOMContentLoaded', initializeSettings);
