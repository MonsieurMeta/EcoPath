
function displayCoinAmount() {
    const coinAmount = localStorage.getItem('coinAmount') || 0; 
    document.getElementById('points').textContent = coinAmount;

    
    const selectedGoal = parseInt(localStorage.getItem('selectedGoal')) || 100;
    const progressPercentage = Math.min((coinAmount / selectedGoal) * 100, 100); 
    
    document.getElementById('goal-progress').style.width = `${progressPercentage}%`;
    document.getElementById('goal-progress-text').textContent = `${Math.round(progressPercentage)}%`;
}


function setAccountCreationTime() {
    const creationTime = new Date().toISOString(); 
    localStorage.setItem('accountCreationTime', creationTime);
}


if (!localStorage.getItem('accountCreationTime')) {
    setAccountCreationTime(); 
}


document.addEventListener('DOMContentLoaded', displayCoinAmount);


const earnMoreButton = document.querySelector('.earn-more');
const popup = document.getElementById('points-popup');
const tips = [
    "English, or Spanish. First one to move is gay.",
    "Save water by turning off the tap while brushing your teeth.",
    "Unplug chargers and electronics when not in use to save energy.",
    "Use reusable shopping bags instead of plastic bags.",
    "Plant a tree to help absorb CO2 and produce oxygen.",
    "Walk or bike instead of driving to reduce your carbon footprint.",
    "Choose energy-efficient appliances for your home.",
    "Reduce, reuse, and recycle to minimize waste.",
    "Compost food scraps to reduce landfill waste.",
    "Collect rainwater for watering plants and gardens.",
    "Switch to a reusable water bottle to cut down on plastic waste.",
    "Use a clothesline to dry your clothes instead of a dryer.",
    "Take shorter showers to conserve water.",
    "Turn off lights when you leave a room.",
    "Use public transportation to reduce emissions.",
    "Buy locally produced goods to reduce transportation emissions.",
    "Install a programmable thermostat to save energy.",
    "Use energy-efficient light bulbs such as LEDs.",
    "Recycle old electronics responsibly.",
    "Choose products with minimal packaging to reduce waste.",
    "Grow your own vegetables to reduce your carbon footprint.",
    "Donate items you no longer use instead of throwing them away.",
    "Use a refillable coffee cup instead of disposable ones.",
    "Support eco-friendly companies and products.",
    "Buy second-hand clothes and goods to reduce waste.",
    "Use natural cleaning products to reduce chemical pollution.",
    "Avoid single-use plastics whenever possible.",
    "Opt for a shower instead of a bath to save water.",
    "Carpool with friends or coworkers to reduce emissions.",
    "Set your computer to sleep mode when not in use.",
    "Shop at farmers' markets to support local agriculture.",
    "Use a push mower instead of a gas-powered one.",
    "Participate in local clean-up events to help the environment.",
    "Switch to paperless billing to reduce paper waste.",
    "Use reusable cloths instead of paper towels.",
    "Install solar panels to generate clean energy.",
    "Make your home energy-efficient by sealing drafts and adding insulation.",
    "Use a reusable lunchbox instead of disposable bags.",
    "Eat less meat to reduce your carbon footprint.",
    "Recycle batteries at designated recycling centers.",
    "Avoid products with microbeads, which can harm marine life.",
    "Use a water filter instead of buying bottled water.",
    "Choose sustainably sourced seafood.",
    "Plant native species in your garden to support local wildlife.",
    "Use a reusable straw instead of a plastic one.",
    "Buy in bulk to reduce packaging waste.",
    "Install a low-flow showerhead to save water.",
    "Use a pressure cooker or slow cooker to save energy.",
    "Opt for e-tickets instead of paper ones when traveling.",
    "Create a wildlife-friendly garden with bird feeders and native plants.",
    "Use rechargeable batteries instead of disposable ones.",
    "Purchase energy-efficient appliances with a high Energy Star rating.",
    "Reuse glass jars and containers for storage.",
    "Use public transportation, bike, or walk instead of driving.",
    "Install a rain barrel to collect water for your garden.",
    "Participate in a local community garden.",
    "Opt for digital books instead of printed ones to save paper.",
    "Use a reusable razor instead of disposable ones.",
    "Turn down your thermostat in the winter and wear layers.",
    "Use a ceiling fan to reduce the need for air conditioning."
];


function displayRandomTip() {
    const tipBox = document.querySelector('.tip-box p');
    const randomIndex = Math.floor(Math.random() * tips.length);
    tipBox.textContent = tips[randomIndex];
}


document.querySelector('.tip-box').addEventListener('click', displayRandomTip);


document.addEventListener('DOMContentLoaded', displayRandomTip);


earnMoreButton.addEventListener('click', () => {
    popup.style.display = 'flex'; 
});

popup.addEventListener('click', (event) => {
    if (event.target === popup) {
        popup.style.display = 'none'; 
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
