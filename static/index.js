document.addEventListener('DOMContentLoaded', () => {
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');

    if (savedUsername && savedPassword) {
        window.location.href = 'main.html';
    }
});


localStorage.setItem('username', username);
localStorage.setItem('password', password);
localStorage.setItem('coinAmount', 0);
localStorage.setItem('metersToday', 0);  // Initialize metersToday with 0

showLoading();

function showLoading() {
    const button = document.querySelector("#login-form button");

    button.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
    button.disabled = true;

    setTimeout(() => {
        window.location.href = 'main.html';
    }, 2000);
}

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