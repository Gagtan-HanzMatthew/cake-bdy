const flames = document.querySelectorAll('.flame');
let confettiTriggered = false; // Flag to track if confetti has been triggered

// Function to trigger confetti explosion
function triggerConfetti() {
    const confettiSettings = { 
        particleCount: 100, 
        spread: 70, 
        origin: { y: 0.6 } 
    };
    confetti(confettiSettings);
}

// Function to display "Happy Birthday" message with a pop-out effect
function showHappyBirthdayMessage() {
    const message = document.createElement('div');
    message.textContent = 'Happy Birthday!';
    message.style.position = 'absolute';
    message.style.top = '20%'; // Move the message to the top of the cake
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%) scale(0)';
    message.style.fontSize = '3rem';
    message.style.color = '#ff80ab';
    message.style.fontWeight = 'bold';
    message.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
    message.style.zIndex = '1000';
    message.style.transition = 'transform 0.5s ease-out'; // Add transition for scaling
    document.body.appendChild(message);

    // Trigger the pop-out effect
    setTimeout(() => {
        message.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);

    // Remove the message after the animation
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Function to play "Happy Birthday" audio
function playHappyBirthdayAudio() {
    const audio = document.getElementById('happy-birthday-audio');
    audio.currentTime = 0; // Reset audio to the beginning
    audio.play();
}

// Function to "blow out" the candles with confetti, message, and audio
function blowOutCandles() {
    if (!confettiTriggered) { // Only trigger confetti, message, and audio if not already triggered
        flames.forEach(flame => flame.style.display = 'none');
        console.log('Candles blown out!');
        triggerConfetti(); // Trigger confetti explosion
        showHappyBirthdayMessage(); // Show "Happy Birthday" message
        playHappyBirthdayAudio(); // Play "Happy Birthday" audio
        confettiTriggered = true; // Set the flag to true
    }
}

// Function to relight the candles
function relightCandles() {
    flames.forEach(flame => flame.style.display = 'block');
    console.log('Candles relit!');
    confettiTriggered = false; // Reset the flag to allow confetti and message again
}

// Create and append the audio meter
const meterContainer = document.createElement('div');
meterContainer.style.position = 'absolute';
meterContainer.style.bottom = '20px';
meterContainer.style.left = '50%';
meterContainer.style.transform = 'translateX(-50%)';
meterContainer.style.width = '200px';
meterContainer.style.height = '20px';
meterContainer.style.backgroundColor = '#ddd';
meterContainer.style.borderRadius = '10px';
meterContainer.style.overflow = 'hidden';
document.body.appendChild(meterContainer);

const meterBar = document.createElement('div');
meterBar.style.height = '100%';
meterBar.style.width = '0%';
meterBar.style.backgroundColor = '#76c7c0';
meterBar.style.transition = 'width 0.1s';
meterContainer.appendChild(meterBar);

// Access the microphone
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        analyser.fftSize = 64; // Further reduce fftSize for higher sensitivity
        microphone.connect(analyser);

        function detectBlow() {
            analyser.getByteFrequencyData(dataArray);
            const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

            // Update the audio meter
            const meterWidth = Math.min((volume / 20) * 100, 100); // Adjust scaling for detecting more sounds
            meterBar.style.width = `${meterWidth}%`;

            console.log('Volume:', volume); // Debugging: Log the volume

            if (volume > 2) { // Slightly increased threshold for detecting sounds
                blowOutCandles();
            }

            requestAnimationFrame(detectBlow);
        }

        detectBlow();
    })
    .catch(err => console.error('Microphone access denied:', err));

// Add event listener to the relight button
document.getElementById('relight-button').addEventListener('click', relightCandles);
