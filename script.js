// Theme Switcher
const themeButton = document.getElementById('theme-button');
const themeDropdown = document.getElementById('theme-dropdown');
const themeOptions = document.querySelectorAll('.theme-option');

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!themeButton.contains(e.target) && !themeDropdown.contains(e.target)) {
        themeDropdown.classList.remove('active');
    }
});

// Toggle dropdown
themeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    themeDropdown.classList.toggle('active');
});

// Theme switching
function setTheme(themeName) {
    // Remove all theme classes
    document.body.classList.remove('theme-purple-pink', 'theme-earth-tones', 'theme-ocean-breeze');
    // Add selected theme class
    document.body.classList.add(`theme-${themeName}`);
    // Update active state in dropdown
    themeOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.theme === themeName);
    });
    // Save theme preference
    localStorage.setItem('selectedTheme', themeName);
}

// Theme option click handlers
themeOptions.forEach(option => {
    option.addEventListener('click', () => {
        setTheme(option.dataset.theme);
        themeDropdown.classList.remove('active');
    });
});

// Load saved theme preference
const savedTheme = localStorage.getItem('selectedTheme') || 'purple-pink';
setTheme(savedTheme);

// Feature Box Navigation
document.querySelectorAll('.feature-box').forEach(box => {
    box.addEventListener('click', () => {
        const feature = box.dataset.feature;
        document.querySelector('.feature-grid').style.display = 'none';
        document.getElementById(`${feature}-section`).classList.add('active');
    });
});

document.querySelectorAll('.back-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.feature-grid').style.display = 'grid';
        document.querySelectorAll('.feature-section').forEach(section => {
            section.classList.remove('active');
        });
    });
});

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.dataset.section;
        
        // Update active states
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        
        link.classList.add('active');
        document.getElementById(targetSection).classList.add('active');
        
        // Show popup when switching to enabled sections
        if (targetSection !== 'stopscrolling' && shouldShowPopup()) {
            showPopup(parseInt(popupDurationInput.value));
            startScrollTimer();
        } else {
            clearInterval(scrollTimer);
        }
    });
});

// Meditation Timer
let timerInterval;
let timeLeft = 0;

const startTimer = document.getElementById('start-timer');
const resetTimer = document.getElementById('reset-timer');
const timerDisplay = document.querySelector('.timer-display');
const minutesInput = document.getElementById('minutes');

function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Timer functionality
startTimer.addEventListener('click', () => {
    if (timerInterval) {
        // If timer is running, stop it
        clearInterval(timerInterval);
        timerInterval = null;
        startTimer.textContent = 'Start';
        return;
    }

    timeLeft = parseInt(minutesInput.value) * 60;
    updateTimerDisplay(timeLeft);
    
    startTimer.textContent = 'Pause';
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            startTimer.textContent = 'Start';
            alert('Meditation session completed!');
        }
    }, 1000);
});

resetTimer.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 0;
    updateTimerDisplay(timeLeft);
    startTimer.textContent = 'Start';
});

// Goals Management
const newGoalInput = document.getElementById('new-goal');
const addGoalBtn = document.getElementById('add-goal-btn');
const goalsList = document.getElementById('goals-list');

// Load goals from localStorage
let goals = JSON.parse(localStorage.getItem('goals')) || [];

function saveGoals() {
    localStorage.setItem('goals', JSON.stringify(goals));
}

function renderGoals() {
    goalsList.innerHTML = '';
    goals.forEach((goal, index) => {
        const li = document.createElement('li');
        li.className = `goal-item ${goal.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${goal.completed ? 'checked' : ''}>
            <span>${goal.text}</span>
            <button class="delete-goal" style="margin-left: auto; background-color: #ff4444;">Delete</button>
        `;

        li.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
            goals[index].completed = e.target.checked;
            li.classList.toggle('completed');
            saveGoals();
        });

        li.querySelector('.delete-goal').addEventListener('click', () => {
            goals.splice(index, 1);
            saveGoals();
            renderGoals();
        });

        goalsList.appendChild(li);
    });
}

function addGoal(text, date = null, time = null) {
    const goal = {
        text,
        completed: false,
        date: date,
        time: time
    };
    goals.push(goal);
    saveGoals();
    renderGoals();
    renderCalendar();
}

addGoalBtn.addEventListener('click', () => {
    const goalText = newGoalInput.value.trim();
    const date = goalDate.value || null;
    const time = goalTime.value || null;
    
    if (goalText) {
        addGoal(goalText, date, time);
        newGoalInput.value = '';
        goalDate.value = '';
        goalTime.value = '';
    }
});

// Initialize goals list
renderGoals();

// FakeSocialMedia Feed
const feed = document.querySelector('.feed');
const placeholderArticles = [
    {
        title: "The Impact of Social Media on Mental Health",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        image: "https://picsum.photos/seed/1/800/400"
    },
    {
        title: "Digital Wellness in the Modern Age",
        content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        image: "https://picsum.photos/seed/2/800/400"
    },
    {
        title: "Finding Balance in a Connected World",
        content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        image: "https://picsum.photos/seed/3/800/400"
    }
];

// Generate more articles for infinite scrolling
function generateArticles(count = 10) {
    for (let i = 0; i < count; i++) {
        const article = document.createElement('div');
        article.className = 'article';
        const randomArticle = placeholderArticles[Math.floor(Math.random() * placeholderArticles.length)];
        article.innerHTML = `
            <img src="${randomArticle.image}" alt="Article image">
            <h3>${randomArticle.title}</h3>
            <p>${randomArticle.content}</p>
        `;
        feed.appendChild(article);
    }
}

// Initial load of articles
generateArticles();

// Infinite scroll
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
        generateArticles(5);
    }
});

// Popup Settings and Functionality
const popupOverlay = document.getElementById('popup-overlay');
const popupMessage = document.getElementById('popup-message');
const popupCountdown = document.getElementById('popup-countdown');
const continueButton = document.getElementById('continue-button');
const popupDurationInput = document.getElementById('popup-duration');
const popupFrequencyInput = document.getElementById('popup-frequency');

const guiltMessages = [
    "Are you sure you want to keep scrolling? There are better things you could be doing.",
    "Think about all the productive tasks you're putting off right now.",
    "Remember your goals? They won't achieve themselves while you're scrolling.",
    "Every minute spent scrolling is a minute lost from personal growth.",
    "Your future self will thank you for choosing productivity over mindless scrolling.",
    "Is this really how you want to spend your precious time?",
    "You set goals for yourself - are you working towards them right now?",
    "Time is your most valuable resource, and you're spending it on scrolling.",
    "What could you accomplish if you invested this time in yourself instead?",
    "Your goals are waiting - they're more important than this feed."
];

function getRandomGoalMessage(goal) {
    const goalMessages = [
        `Remember your goal: "${goal.text}" - Is scrolling helping you achieve this?`,
        `You said you wanted to: "${goal.text}" - Why are you here instead?`,
        `Focus on your goal: "${goal.text}" - This can wait.`,
        `"${goal.text}" - This was important to you. Don't lose sight of it.`,
        `Your goal is waiting: "${goal.text}" - Make it happen!`,
        `You have a goal scheduled for ${new Date(goal.date).toLocaleDateString()}: "${goal.text}" - Focus on that instead!`,
        `${goal.time ? `At ${goal.time} today` : 'Today'}, you planned to: "${goal.text}" - Stay on track!`,
        `Your schedule shows "${goal.text}" - That's more important than scrolling.`
    ];
    return goalMessages[Math.floor(Math.random() * goalMessages.length)];
}

function getPopupMessage() {
    // 50% chance to show a goal-based message if there are uncompleted goals
    const uncompleteGoals = goals.filter(goal => !goal.completed);
    if (uncompleteGoals.length > 0 && Math.random() < 0.5) {
        const randomGoal = uncompleteGoals[Math.floor(Math.random() * uncompleteGoals.length)];
        return getRandomGoalMessage(randomGoal);
    }
    return guiltMessages[Math.floor(Math.random() * guiltMessages.length)];
}

let popupTimer;
let scrollTimer;
let isPopupActive = false;

function showPopup(duration) {
    if (isPopupActive) return;
    
    isPopupActive = true;
    popupMessage.textContent = getPopupMessage();
    popupOverlay.classList.add('active');
    continueButton.disabled = true;
    
    let timeLeft = duration;
    popupCountdown.textContent = timeLeft;
    
    popupTimer = setInterval(() => {
        timeLeft--;
        popupCountdown.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            continueButton.disabled = false;
            clearInterval(popupTimer);
        }
    }, 1000);
}

function hidePopup() {
    isPopupActive = false;
    popupOverlay.classList.remove('active');
    clearInterval(popupTimer);
    startScrollTimer();
}

function startScrollTimer() {
    if (scrollTimer) clearInterval(scrollTimer);
    
    const frequency = parseInt(popupFrequencyInput.value) * 1000;
    scrollTimer = setInterval(() => {
        const activeSection = document.querySelector('.section.active').id;
        if (activeSection !== 'stopscrolling' && shouldShowPopup()) {
            showPopup(parseInt(popupDurationInput.value));
        }
    }, frequency);
}

continueButton.addEventListener('click', hidePopup);

// Save popup settings to localStorage
function savePopupSettings() {
    localStorage.setItem('popupSettings', JSON.stringify({
        duration: popupDurationInput.value,
        frequency: popupFrequencyInput.value
    }));
}

// Load popup settings from localStorage
function loadPopupSettings() {
    const settings = JSON.parse(localStorage.getItem('popupSettings'));
    if (settings) {
        popupDurationInput.value = settings.duration;
        popupFrequencyInput.value = settings.frequency;
    }
}

// Save settings when changed
popupDurationInput.addEventListener('change', savePopupSettings);
popupFrequencyInput.addEventListener('change', savePopupSettings);

// Load settings on page load
loadPopupSettings();

const returnButton = document.getElementById('return-button');

returnButton.addEventListener('click', () => {
    // Hide popup
    hidePopup();
    clearInterval(scrollTimer);
    
    // Switch to StopScrolling section
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    const stopScrollingLink = document.querySelector('[data-section="stopscrolling"]');
    stopScrollingLink.classList.add('active');
    document.getElementById('stopscrolling').classList.add('active');
});

// Video Feed Content
const videoFeed = document.querySelector('.video-feed');
const videoTitles = [
    "Amazing Dance Moves! 🕺",
    "Cute Puppy Does Tricks 🐕",
    "Life Hack You Won't Believe! 😱",
    "Cooking Tutorial Under 1 Minute 🍳",
    "Incredible Magic Trick ✨",
    "Daily Motivation 💪",
    "Funny Cat Compilation 😺",
    "Travel in 60 Seconds 🌎"
];

function generateVideoFeed(count = 5) {
    for (let i = 0; i < count; i++) {
        const video = document.createElement('div');
        video.className = 'video-item';
        const randomTitle = videoTitles[Math.floor(Math.random() * videoTitles.length)];
        const likes = Math.floor(Math.random() * 10000);
        const dislikes = Math.floor(Math.random() * 1000);
        
        video.innerHTML = `
            <div class="video-container">
                <div class="video-placeholder">
                    <i class="fas fa-play-circle"></i>
                </div>
            </div>
            <div class="video-info">
                <div class="username">@${generateUsername()}</div>
                <div class="timestamp">${generateTimestamp()}</div>
                <p>${randomTitle}</p>
            </div>
            <div class="interaction-bar">
                <button class="interaction-button like-button">
                    <i class="fas fa-heart"></i>
                    <span class="interaction-count">${formatNumber(likes)}</span>
                </button>
                <button class="interaction-button dislike-button">
                    <i class="fas fa-thumbs-down"></i>
                    <span class="interaction-count">${formatNumber(dislikes)}</span>
                </button>
            </div>
        `;
        
        addInteractionListeners(video);
        videoFeed.appendChild(video);
    }
}

// Photo Feed Content
const photoFeed = document.querySelector('.photo-feed');
const photoDescriptions = [
    "Perfect sunset view 🌅",
    "Today's outfit check ✨",
    "Coffee art goals ☕",
    "Weekend vibes 🎉",
    "Nature's beauty 🌿",
    "Food photography 🍕",
    "Travel memories 🌎",
    "Artistic shot 🎨"
];

function generatePhotoFeed(count = 8) {
    for (let i = 0; i < count; i++) {
        const photo = document.createElement('div');
        photo.className = 'photo-item';
        const randomDesc = photoDescriptions[Math.floor(Math.random() * photoDescriptions.length)];
        const likes = Math.floor(Math.random() * 5000);
        const dislikes = Math.floor(Math.random() * 500);
        
        photo.innerHTML = `
            <div class="photo-container">
                <img class="photo-placeholder" src="https://picsum.photos/seed/${Math.random()}/400/400" alt="Random photo">
            </div>
            <div class="photo-info">
                <div class="username">@${generateUsername()}</div>
                <div class="timestamp">${generateTimestamp()}</div>
                <p>${randomDesc}</p>
            </div>
            <div class="interaction-bar">
                <button class="interaction-button like-button">
                    <i class="fas fa-heart"></i>
                    <span class="interaction-count">${formatNumber(likes)}</span>
                </button>
                <button class="interaction-button dislike-button">
                    <i class="fas fa-thumbs-down"></i>
                    <span class="interaction-count">${formatNumber(dislikes)}</span>
                </button>
            </div>
        `;
        
        addInteractionListeners(photo);
        photoFeed.appendChild(photo);
    }
}

// Utility Functions
function generateUsername() {
    const prefixes = ['cool', 'awesome', 'creative', 'happy', 'sunny', 'clever'];
    const suffixes = ['user', 'person', 'creator', 'star', 'guru'];
    const numbers = Math.floor(Math.random() * 1000);
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return `${prefix}_${suffix}${numbers}`;
}

function generateTimestamp() {
    const times = ['1 hour ago', '2 hours ago', '3 hours ago', 'Just now', '5 minutes ago', 'Yesterday'];
    return times[Math.floor(Math.random() * times.length)];
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function addInteractionListeners(element) {
    const likeBtn = element.querySelector('.like-button');
    const dislikeBtn = element.querySelector('.dislike-button');
    
    likeBtn.addEventListener('click', () => {
        const count = likeBtn.querySelector('.interaction-count');
        if (likeBtn.classList.toggle('liked')) {
            count.textContent = formatNumber(parseInt(count.textContent.replace(/[KM]/g, '')) + 1);
            dislikeBtn.classList.remove('disliked');
        } else {
            count.textContent = formatNumber(parseInt(count.textContent.replace(/[KM]/g, '')) - 1);
        }
    });
    
    dislikeBtn.addEventListener('click', () => {
        const count = dislikeBtn.querySelector('.interaction-count');
        if (dislikeBtn.classList.toggle('disliked')) {
            count.textContent = formatNumber(parseInt(count.textContent.replace(/[KM]/g, '')) + 1);
            likeBtn.classList.remove('liked');
        } else {
            count.textContent = formatNumber(parseInt(count.textContent.replace(/[KM]/g, '')) - 1);
        }
    });
}

// Initialize feeds
generateVideoFeed();
generatePhotoFeed();

// Infinite scroll for all feeds
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
        if (document.getElementById('fakesocialmedia').classList.contains('active')) {
            generateArticles(5);
        } else if (document.getElementById('fakevideos').classList.contains('active')) {
            generateVideoFeed(3);
        } else if (document.getElementById('fakephotos').classList.contains('active')) {
            generatePhotoFeed(4);
        }
    }
});

// Website toggle functionality
const websiteToggles = {
    fakesocialmedia: document.getElementById('toggle-fakesocialmedia'),
    fakevideos: document.getElementById('toggle-fakevideos'),
    fakephotos: document.getElementById('toggle-fakephotos'),
    schoolwork: document.getElementById('toggle-schoolwork')
};

// Save toggle states to localStorage
function saveToggleStates() {
    const states = {};
    for (const [key, toggle] of Object.entries(websiteToggles)) {
        states[key] = toggle.checked;
    }
    localStorage.setItem('popupToggles', JSON.stringify(states));
}

// Load toggle states from localStorage
function loadToggleStates() {
    const states = JSON.parse(localStorage.getItem('popupToggles'));
    if (states) {
        for (const [key, value] of Object.entries(states)) {
            if (websiteToggles[key]) {
                websiteToggles[key].checked = value;
            }
        }
    }
}

// Add event listeners to toggles
Object.values(websiteToggles).forEach(toggle => {
    toggle.addEventListener('change', saveToggleStates);
});

// Load toggle states on page load
loadToggleStates();

// Modify the showPopup function to check if popups are enabled for the current section
function shouldShowPopup() {
    const activeSection = document.querySelector('.section.active').id;
    const toggle = websiteToggles[activeSection];
    return toggle ? toggle.checked : false;
}

// Schoolwork functionality
const saveAnswersBtn = document.getElementById('save-answers');
const textareas = document.querySelectorAll('.question textarea');

// Save answers to localStorage
function saveAnswers() {
    const answers = {};
    textareas.forEach((textarea, index) => {
        answers[`q${index + 1}`] = textarea.value;
    });
    localStorage.setItem('schoolworkAnswers', JSON.stringify(answers));
    alert('Answers saved successfully!');
}

// Load answers from localStorage
function loadAnswers() {
    const answers = JSON.parse(localStorage.getItem('schoolworkAnswers'));
    if (answers) {
        textareas.forEach((textarea, index) => {
            textarea.value = answers[`q${index + 1}`] || '';
        });
    }
}

// Add event listeners
saveAnswersBtn.addEventListener('click', saveAnswers);

// Load answers on page load
loadAnswers();

// Calendar functionality
const calendarDays = document.querySelector('.calendar-days');
const calendarMonth = document.getElementById('calendar-month');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const selectedDateSpan = document.getElementById('selected-date');
const eventsList = document.getElementById('events-list');
const goalDate = document.getElementById('goal-date');
const goalTime = document.getElementById('goal-time');

let currentDate = new Date();
let selectedDate = new Date();

// Calendar rendering functions
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month display
    calendarMonth.textContent = new Date(year, month).toLocaleString('default', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    // Clear previous days
    calendarDays.innerHTML = '';
    
    // Get first day of month and total days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Add previous month's days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayDiv = createDayElement(prevMonthDays - i, true);
        calendarDays.appendChild(dayDiv);
    }
    
    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = createDayElement(day, false);
        calendarDays.appendChild(dayDiv);
    }
    
    // Add next month's days to fill grid
    const totalCells = 42;
    const remainingCells = totalCells - (firstDay + daysInMonth);
    for (let day = 1; day <= remainingCells; day++) {
        const dayDiv = createDayElement(day, true);
        calendarDays.appendChild(dayDiv);
    }
    
    // Update events list
    updateEventsList();
}

function createDayElement(day, isOtherMonth) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';
    if (isOtherMonth) dayDiv.classList.add('other-month');
    
    const dayNumber = document.createElement('span');
    dayNumber.textContent = day;
    dayDiv.appendChild(dayNumber);
    
    // Check if this day has events
    const dayDate = new Date(
        currentDate.getFullYear(),
        isOtherMonth ? (currentDate.getMonth() + (day > 15 ? -1 : 1)) : currentDate.getMonth(),
        day
    );
    
    if (hasEvents(dayDate)) {
        dayDiv.classList.add('has-events');
    }
    
    // Check if this is today
    const today = new Date();
    if (dayDate.toDateString() === today.toDateString()) {
        dayDiv.classList.add('today');
    }
    
    // Check if this is selected date
    if (dayDate.toDateString() === selectedDate.toDateString()) {
        dayDiv.classList.add('selected');
    }
    
    dayDiv.addEventListener('click', () => {
        document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
        dayDiv.classList.add('selected');
        selectedDate = dayDate;
        updateEventsList();
    });
    
    return dayDiv;
}

function hasEvents(date) {
    return goals.some(goal => {
        if (!goal.date) return false;
        const goalDate = new Date(goal.date);
        return goalDate.toDateString() === date.toDateString();
    });
}

function updateEventsList() {
    selectedDateSpan.textContent = selectedDate.toLocaleDateString('default', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    eventsList.innerHTML = '';
    
    const dayEvents = goals.filter(goal => {
        if (!goal.date) return false;
        const goalDate = new Date(goal.date);
        return goalDate.toDateString() === selectedDate.toDateString();
    });
    
    dayEvents.sort((a, b) => {
        if (!a.time) return 1;
        if (!b.time) return -1;
        return a.time.localeCompare(b.time);
    });
    
    dayEvents.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event-item';
        
        eventDiv.innerHTML = `
            ${event.time ? `<span class="event-time">${event.time}</span>` : ''}
            <span class="event-text">${event.text}</span>
            <div class="event-actions">
                <button class="complete-event" ${event.completed ? 'disabled' : ''}>
                    ${event.completed ? 'Completed' : 'Complete'}
                </button>
            </div>
        `;
        
        const completeBtn = eventDiv.querySelector('.complete-event');
        completeBtn.addEventListener('click', () => {
            event.completed = true;
            saveGoals();
            renderGoals();
            updateEventsList();
        });
        
        eventsList.appendChild(eventDiv);
    });
}

// Navigation buttons
prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// Initialize calendar
renderCalendar();

// Add hover sounds to interactive elements
document.querySelectorAll('button, .interaction-button, .theme-option').forEach(element => {
    element.addEventListener('mouseenter', () => {
        // No sound effect for hover
    });
}); 