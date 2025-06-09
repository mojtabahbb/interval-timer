// DOM Elements
const timeDisplay = document.getElementById("time-remaining");
const intervalNameDisplay = document.getElementById("current-interval-name");
const nextIntervalDisplay = document.getElementById("next-interval-preview");
const startButton = document.getElementById("start-btn");
const pauseButton = document.getElementById("pause-btn");
const resetButton = document.getElementById("reset-btn");

// Workout Creation DOM Elements
const newIntervalName = document.getElementById("new-interval-name");
const newIntervalMinutes = document.getElementById("new-interval-minutes");
const newIntervalSeconds = document.getElementById("new-interval-seconds");
const addIntervalButton = document.getElementById("add-interval-btn");
const currentWorkoutList = document.getElementById("current-workout-list");
const loadWorkoutButton = document.getElementById("load-workout-btn");

// Workout Creation State
let newWorkoutIntervals = [];
let workoutRoutine = []; // Mutable workout routine

// State Variables
let currentIntervalIndex = 0;
let currentInterval = null;
let timeLeft = 0;
let timerInterval = null;
let isRunning = false;

// Add interval to the workout list
function addIntervalToList() {
  const name = newIntervalName.value.trim();
  const minutes = parseInt(newIntervalMinutes.value) || 0;
  const seconds = parseInt(newIntervalSeconds.value) || 0;
  const totalSeconds = minutes * 60 + seconds;

  // Validate inputs
  if (!name) {
    alert("Please enter an interval name");
    return;
  }
  if (totalSeconds <= 0) {
    alert("Duration must be greater than 0");
    return;
  }

  // Create interval object
  const interval = {
    name: name,
    duration: totalSeconds,
  };

  // Add to array and update display
  newWorkoutIntervals.push(interval);
  renderWorkoutList();

  // Clear inputs
  newIntervalName.value = "";
  newIntervalMinutes.value = "";
  newIntervalSeconds.value = "";
  newIntervalName.focus();
}

// Render the workout list
function renderWorkoutList() {
  currentWorkoutList.innerHTML = "";
  newWorkoutIntervals.forEach((interval, index) => {
    const li = document.createElement("li");
    const minutes = Math.floor(interval.duration / 60);
    const seconds = interval.duration % 60;
    const durationStr = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    li.innerHTML = `
      <span>${interval.name}</span>
      <span>${durationStr}</span>
    `;
    currentWorkoutList.appendChild(li);
  });
}

// Load workout into timer
function loadUserWorkoutIntoTimer() {
  if (newWorkoutIntervals.length === 0) {
    alert("Please add at least one interval to your workout");
    return;
  }

  // Deep copy the intervals to prevent reference issues
  workoutRoutine = newWorkoutIntervals.map((interval) => ({
    name: interval.name,
    duration: interval.duration,
  }));

  // Reset the timer with the new workout
  resetWorkout();

  // Show success message
  const successMessage = document.createElement("div");
  successMessage.className = "success-message";
  successMessage.textContent = "Workout loaded successfully!";
  document.querySelector(".workout-list-container").appendChild(successMessage);

  // Remove success message after 2 seconds
  setTimeout(() => {
    successMessage.remove();
  }, 2000);

  // Hide workout creation area and show timer
  document.getElementById("workout-creation-area").style.display = "none";
  document.getElementById("app-view").style.display = "block";
}

// Reset the workout
function resetWorkout() {
  pauseTimer();

  // Check if there's a workout routine
  if (workoutRoutine.length === 0) {
    timeDisplay.textContent = "00:00";
    intervalNameDisplay.textContent = "No workout loaded";
    nextIntervalDisplay.textContent = "Add intervals to create a workout";
    startButton.disabled = true;
    return;
  }

  currentIntervalIndex = 0;
  currentInterval = workoutRoutine[currentIntervalIndex];
  timeLeft = currentInterval.duration;
  updateIntervalNameDisplay();
  updateDisplay();
  updateNextIntervalPreview();
  startButton.disabled = false;
}

// Update the interval name display
function updateIntervalNameDisplay() {
  if (!currentInterval) {
    intervalNameDisplay.textContent = "No workout loaded";
    return;
  }
  intervalNameDisplay.textContent = `Current: ${currentInterval.name}`;
}

// Update the next interval preview
function updateNextIntervalPreview() {
  if (!currentInterval) {
    nextIntervalDisplay.textContent = "Add intervals to create a workout";
    return;
  }

  if (currentIntervalIndex < workoutRoutine.length - 1) {
    nextIntervalDisplay.textContent = `Next: ${workoutRoutine[currentIntervalIndex + 1].name}`;
  } else {
    nextIntervalDisplay.textContent = "Last Interval";
  }
}

// Update the time display
function updateDisplay() {
  timeDisplay.textContent = formatTime(timeLeft);
}

// Start the timer
function startTimer() {
  if (workoutRoutine.length === 0) {
    alert("Please create and load a workout first");
    return;
  }

  if (!isRunning && timeLeft > 0) {
    isRunning = true;
    startButton.disabled = true;
    pauseButton.disabled = false;

    timerInterval = setInterval(() => {
      timeLeft--;
      updateDisplay();

      // Play countdown sound for last 3 seconds
      if (timeLeft <= 3 && timeLeft > 0) {
        playBeep(400, 100);
      }

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        isRunning = false;
        console.log(`Timer finished for ${currentInterval.name}!`);

        // Play interval end sound
        playIntervalEndSound();

        // Move to next interval if available
        if (currentIntervalIndex < workoutRoutine.length - 1) {
          loadInterval(currentIntervalIndex + 1);
          startTimer(); // Auto-start next interval
        } else {
          // Play workout complete sound
          playWorkoutCompleteSound();
          console.log("Workout Complete!");
          nextIntervalDisplay.textContent = "Workout Complete!";
          startButton.disabled = true;
          pauseButton.disabled = true;
        }
      }
    }, 1000);
  }
}

// Pause the timer
function pauseTimer() {
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
    startButton.disabled = false;
    pauseButton.disabled = true;
  }
}

// Event Listeners
startButton.addEventListener("click", () => {
  initAudio(); // Initialize audio on first user interaction
  startTimer();
});
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetWorkout);
addIntervalButton.addEventListener("click", addIntervalToList);
loadWorkoutButton.addEventListener("click", loadUserWorkoutIntoTimer);

// Initialize the application
function initializeApp() {
  // Set initial button states
  startButton.disabled = true;
  pauseButton.disabled = true;

  // Initialize workout
  resetWorkout();
}

// Start the application
initializeApp();

// Audio Context and Sound Generation
let audioContext = null;

// Initialize audio context on first user interaction
function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// Generate a beep sound
function playBeep(frequency = 800, duration = 200) {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration / 1000);
}

// Play interval end sound
function playIntervalEndSound() {
  playBeep(800, 200); // Higher pitch for interval end
}

// Play workout complete sound
function playWorkoutCompleteSound() {
  // Play a sequence of beeps for workout completion
  playBeep(600, 200);
  setTimeout(() => playBeep(800, 200), 250);
  setTimeout(() => playBeep(1000, 400), 500);
}

// Format time as MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Load a specific interval
function loadInterval(index) {
  currentIntervalIndex = index;
  currentInterval = workoutRoutine[currentIntervalIndex];
  timeLeft = currentInterval.duration;
  updateIntervalNameDisplay();
  updateDisplay();
  updateNextIntervalPreview();
}
