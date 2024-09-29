(function() {
    var timerLoop;
    const timer = document.querySelector('.timer');
    const semicircles = document.querySelectorAll('.semicircle');
    let isPaused = true;
    var futureTime = null;
    var setTime = 0;
    var remainingTime = 0;

    // Declare and create the necessary elements
    const hrsDiv = document.createElement('div');
    const colon1 = document.createElement('div');
    colon1.className = 'colon';
    colon1.textContent = ':';
    const minsDiv = document.createElement('div');
    const colon2 = document.createElement('div');
    colon2.className = 'colon';
    colon2.textContent = ':';
    const secsDiv = document.createElement('div');

    // Check if there's a saved state in sessionStorage
    if (sessionStorage.getItem('timerState')) {
        const savedState = JSON.parse(sessionStorage.getItem('timerState'));
        futureTime = savedState.futureTime;
        isPaused = savedState.isPaused;
        setTime = savedState.setTime;
        remainingTime = savedState.remainingTime; // Load remainingTime from state

        if (setTime > 0 && futureTime) {  // Only start if setTime and futureTime are valid
            if (!isPaused) {
                startTimer();
            } else {
                updateTimerDisplay(remainingTime); // Update the display to show paused time
            }

            // Update the button text based on the saved paused state
            document.getElementById('pauseTimer').textContent = isPaused ? 'Resume Timer' : 'Pause Timer';
        }
    }

    // Append the elements to the timer container
    function normalizeTime(hours, minutes, seconds) {
        if (seconds >= 60) {
            minutes += Math.floor(seconds / 60);
            seconds = seconds % 60;
        }
        if (minutes >= 60) {
            hours += Math.floor(minutes / 60);
            minutes = minutes % 60;
        }
        if (hours > 99) hours = 99;
        if (minutes > 99) minutes = 99;
        if (seconds > 99) seconds = 99;

        return { hours, minutes, seconds };
    }

    function countDownTimer() {
        if (!isPaused) {
            const currentTime = Date.now();
            remainingTime = futureTime - currentTime; // Calculate remaining time
        }

        const angle = (remainingTime / setTime) * 360;

        if (angle > 180) {
            semicircles[2].style.display = 'none';
            semicircles[0].style.transform = 'rotate(180deg)';
            semicircles[1].style.transform = `rotate(${angle}deg)`;
        } else {
            semicircles[2].style.display = 'block';
            semicircles[0].style.transform = `rotate(${angle}deg)`;
            semicircles[1].style.transform = `rotate(${angle}deg)`;
        }

        updateTimerDisplay(remainingTime);

        if (remainingTime <= 0) {
            clearInterval(timerLoop);
            semicircles[0].style.display = 'none';
            semicircles[1].style.display = 'none';
            semicircles[2].style.display = 'none';
            hrsDiv.textContent = `00`;
            minsDiv.textContent = `00`;
            secsDiv.textContent = `00`;
            sessionStorage.removeItem('timerState'); // Clear the saved state when timer ends
        }
    }

    function updateTimerDisplay(remainingTime) {
        const hrs = Math.floor((remainingTime / (1000 * 60 * 60)) % 24).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        const mins = Math.floor((remainingTime / (1000 * 60)) % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        const secs = (Math.floor((remainingTime / 1000) % 60) + 1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        
        while (timer.firstChild) {
            timer.removeChild(timer.firstChild);
        }

        timer.appendChild(hrsDiv);
        timer.appendChild(colon1);
        timer.appendChild(minsDiv);
        timer.appendChild(colon2);
        timer.appendChild(secsDiv);

        hrsDiv.textContent = `${hrs}`;
        minsDiv.textContent = `${mins}`;
        secsDiv.textContent = `${secs}`;
    }

    function startTimer() {
        clearInterval(timerLoop);
        timerLoop = setInterval(countDownTimer, 10);
    }

    function saveTimerState() {
        if (futureTime && setTime > 0) {  // Only save state if timer has been initialized
            sessionStorage.setItem('timerState', JSON.stringify({
                futureTime,
                isPaused,
                setTime,
                remainingTime // Save the current remaining time
            }));
        }
    }

    document.getElementById('setTimer').addEventListener('click', function() {
        isPaused = false;

        semicircles[0].style.display = 'block';
        semicircles[1].style.display = 'block';
        semicircles[2].style.display = 'block';

        var hours = document.getElementById('hours').value;
        var minutes = document.getElementById('minutes').value;
        var seconds = document.getElementById('seconds').value;

        hours = hours === "" ? 0 : parseInt(hours, 10);
        minutes = minutes === "" ? 0 : parseInt(minutes, 10);
        seconds = seconds === "" ? 0 : parseInt(seconds, 10);

        const normalizedTime = normalizeTime(hours, minutes, seconds);
        setTime = (normalizedTime.hours * 3600000) + (normalizedTime.minutes * 60000) + (normalizedTime.seconds * 1000);
        remainingTime = setTime; // Initialize remainingTime with the full setTime
        futureTime = Date.now() + remainingTime;

        saveTimerState();
        startTimer();
    });

    document.getElementById('pauseTimer').addEventListener('click', function() {
        if (futureTime && setTime > 0) {  // Only allow pause/resume if timer has been started
            if (!isPaused) {
                clearInterval(timerLoop);
                isPaused = true;
                saveTimerState(); // Save the state after pausing
                document.getElementById('pauseTimer').textContent = 'Resume Timer';
            } else {
                futureTime = Date.now() + remainingTime;
                isPaused = false; // Update the paused state before saving
                saveTimerState(); // Save the state after resuming
                startTimer();
                document.getElementById('pauseTimer').textContent = 'Pause Timer';
            }
        }
    });
    

    document.getElementById('clearTimer').addEventListener('click', function() {
        clearInterval(timerLoop);
        
        // Hide the semicircles and reset the timer display
        semicircles[0].style.display = 'none';
        semicircles[1].style.display = 'none';
        semicircles[2].style.display = 'none';
        hrsDiv.textContent = `00`;
        minsDiv.textContent = `00`;
        secsDiv.textContent = `00`;
    
        // Reset timer variables
        futureTime = null;
        remainingTime = 0;
        setTime = 0;
        isPaused = true;
    
        // Update the pause/resume button text
        document.getElementById('pauseTimer').textContent = 'Pause Timer';
    
        // Clear the saved state
        sessionStorage.removeItem('timerState');
    });
    
})();
