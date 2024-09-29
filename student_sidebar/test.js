document.getElementById('loadPage').addEventListener('click', function() {
    document.getElementById('loadPage').style.display = 'none'
    // Fetch the timer page HTML
    fetch('timer_page.html')
        .then(response => response.text())
        .then(html => {
            // Create a container div for the timer page content
            const container = document.createElement('div');
            container.innerHTML = html;

            // Append the container to the body
            document.body.appendChild(container);

            // Dynamically load the timer page CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'timer_page.css';
            document.head.appendChild(link);

            // Dynamically load the timer page JS
            const script = document.createElement('script');
            script.src = 'timer_page.js';
            document.body.appendChild(script);
        })
        .catch(error => console.error('Error loading the timer page:', error));
});
