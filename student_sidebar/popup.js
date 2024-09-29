var sidebarActive = false;

const toggleButton = document.getElementById('toggleSidebar');

toggleButton.addEventListener('click', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = tabs[0].url;
    if (url.startsWith('chrome://')) {
      alert('This extension cannot be used on chrome:// URLs. Please navigate to a regular web page.');
      return;
    }
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: toggleAndGetTimerPage
    });
  });
});

function toggleAndGetTimerPage() {

  function toggleSidebar() {
    var sidebar = document.getElementById('my-sidebar');
    if (sidebar) {
      if (document.body.classList.contains('sidebar-visible')) {
        document.body.classList.remove('sidebar-visible'); // Hide sidebar
        sidebarActive = false;
      } else {
        document.body.classList.add('sidebar-visible'); // Show sidebar
        sidebarActive = true;
      }
    } else {
      sidebar = document.createElement('div');
      sidebar.id = 'my-sidebar';
      
      // Create the "Go to Timer" button
      const goToTimerButton = document.createElement('button');
      goToTimerButton.id = 'goToTimer';
      goToTimerButton.textContent = 'Go to Timer';

      // Append the button to the sidebar
      sidebar.appendChild(goToTimerButton);

      timer_div = document.createElement('div');
      timer_div.id = 'timer-content';
      sidebar.appendChild(timer_div);
      
      // Append the sidebar to the body
      document.body.appendChild(sidebar);
      document.body.classList.add('sidebar-visible'); // Show sidebar
      sidebarActive = true;

      const goToCalc = document.createElement('button');
      goToCalc.id = 'goToCalc';
      goToCalc.textContent = 'Go to Calculator';
      sidebar.appendChild(goToCalc);
      calc_div = document.createElement('div');
      calc_div.id = 'calc-content';
      sidebar.appendChild(calc_div);
      

      const goToNotes = document.createElement('button');
      goToNotes.id = 'goToNotes';
      goToNotes.textContent = 'Go to Notes';
      sidebar.appendChild(goToNotes);
      notes_div = document.createElement('div');
      notes_div.id = 'notes-content';
      sidebar.appendChild(notes_div);
      


      // Now attach the event listener to the "Go to Timer" button
      getCalcPage();
      getTimerPage();
      getNotesPage();

    }
  }

  function getTimerPage() {
    const sidebar = document.getElementById('my-sidebar');
    const goToTimerButton = document.getElementById('goToTimer');
    const timer_page = document.getElementById('timer-content');
    const gotoCalcButton = document.getElementById('goToCalc');
    const goToNotesButton = document.getElementById('goToNotes');

    goToTimerButton.addEventListener('click', function () {
      // Hide the "Go to Timer" button after it's clicked
      goToTimerButton.style.display = 'none';
      gotoCalcButton.style.display = 'none';
      goToNotesButton.style.display = 'none';
  
      // Fetch the timer page HTML
      fetch(chrome.runtime.getURL('timer_page.html'))
        .then(response => response.text())
        .then(html => {
          // Add the Back button at the top
          const backButton = document.createElement('button');
          backButton.id = 'backButton';
          backButton.textContent = 'Back';
  
          // Clear any existing content in the timer_page div
          timer_page.innerHTML = '';
  
          // Append the Back button and then the timer page content
          timer_page.appendChild(backButton);
  
          const timerContentDiv = document.createElement('div');
          timerContentDiv.innerHTML = html;
          timer_page.appendChild(timerContentDiv);
  
          // Dynamically load the CSS for the timer page
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = chrome.runtime.getURL('timer_page.css');
          document.head.appendChild(link);
  
          // Dynamically load the JS for the timer page
          const script = document.createElement('script');
          script.src = chrome.runtime.getURL('timer_page.js');
          document.body.appendChild(script);
  
          // Attach event listener to the Back button
          backButton.addEventListener('click', function () {
            console.log('Back button clicked');
            // Remove the timer page content and back button
            timer_page.innerHTML = '';
  
            // Show the "Go to Timer" button again
            goToTimerButton.style.display = 'block';
            gotoCalcButton.style.display = 'block';
            goToNotesButton.style.display = 'block';
          });
        })
        .catch(error => console.error('Error loading the timer page:', error));
    });
  }

  function getCalcPage() {
    const sidebar = document.getElementById('my-sidebar');
    const goToTimerButton = document.getElementById('goToTimer');
    const gotoCalcButton = document.getElementById('goToCalc');
    const goToNotesButton = document.getElementById('goToNotes');
    const calc_page = document.getElementById('calc-content');
  
    gotoCalcButton.addEventListener('click', function () {
      // Hide the "Go to Timer" button after it's clicked
      goToTimerButton.style.display = 'none';
      gotoCalcButton.style.display = 'none';
  
      // Fetch the timer page HTML
      fetch(chrome.runtime.getURL('calculator.html'))
        .then(response => response.text())
        .then(html => {
          // Add the Back button at the top
          const backButton = document.createElement('button');
          backButton.id = 'backButton';
          backButton.textContent = 'Back';
  
          // Clear any existing content in the timer_page div
          calc_page.innerHTML = '';
  
          // Append the Back button and then the timer page content
          calc_page.appendChild(backButton);
  
          const calcContentDiv = document.createElement('div');
          calcContentDiv.innerHTML = html;
          calc_page.appendChild(calcContentDiv);
  
          // Dynamically load the CSS for the timer page

          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = chrome.runtime.getURL('calculator.css'); // Ensure this file path is correct
          document.head.appendChild(link);

  
          // Dynamically load the JS for the timer page
          const script = document.createElement('script');
          script.src = chrome.runtime.getURL('calculator.js');
          document.body.appendChild(script);
  
          // Attach event listener to the Back button
          backButton.addEventListener('click', function () {
            console.log('Back button clicked');
            // Remove the timer page content and back button
            calc_page.innerHTML = '';
  
            // Show the "Go to Timer" button again
            goToTimerButton.style.display = 'block';
            gotoCalcButton.style.display = 'block';
            goToNotesButton.style.display = 'block';
          });
        })
        .catch(error => console.error('Error loading the timer page:', error));
    });
  }

  function getNotesPage() {
    const sidebar = document.getElementById('my-sidebar');
    const goToTimerButton = document.getElementById('goToTimer');
    const gotoCalcButton = document.getElementById('goToCalc');
    const goToNotesButton = document.getElementById('goToNotes');
    const notes_page = document.getElementById('notes-content');
  
    goToNotesButton.addEventListener('click', function () {
      // Hide the "Go to Timer" button after it's clicked
      goToTimerButton.style.display = 'none';
      gotoCalcButton.style.display = 'none';
      goToNotesButton.style.display = 'none';

  
      // Fetch the timer page HTML
      fetch(chrome.runtime.getURL('notes.html'))
        .then(response => response.text())
        .then(html => {
          // Add the Back button at the top
          const backButton = document.createElement('button');
          backButton.id = 'backButton';
          backButton.textContent = 'Back';
  
          // Clear any existing content in the timer_page div
          notes_page.innerHTML = '';
  
          // Append the Back button and then the timer page content
          notes_page.appendChild(backButton);
  
          const notesContentDiv = document.createElement('div');
          notesContentDiv.innerHTML = html;
          notes_page.appendChild(notesContentDiv);
  
          // Dynamically load the CSS for the timer page

          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = chrome.runtime.getURL('notes.css'); // Ensure this file path is correct
          document.head.appendChild(link);

  
          // Dynamically load the JS for the timer page
          const script = document.createElement('script');
          script.src = chrome.runtime.getURL('notes.js');
          document.body.appendChild(script);
  
          // Attach event listener to the Back button
          backButton.addEventListener('click', function () {
            console.log('Back button clicked');
            // Remove the timer page content and back button
            notes_page.innerHTML = '';
  
            // Show the "Go to Timer" button again
            goToTimerButton.style.display = 'block';
            gotoCalcButton.style.display = 'block';
            goToNotesButton.style.display = 'block';
          });
        })
        .catch(error => console.error('Error loading the timer page:', error));
    });
  }
  

  toggleSidebar();
}