// Get references to the HTML elements
(function() {
    const noteTitle = document.getElementById('noteTitle');
    const noteInput = document.getElementById('noteInput');
    const clearNotesButton = document.getElementById('clearNotes'); // Make sure the button exists in your HTML
    const newPageButton = document.getElementById('newPage'); // Make sure the button exists in your HTML
    const savedNotesContainer = document.getElementById('savedNotesContainer');

    // Function to load the saved state from localStorage
    function loadSavedState() {
        const savedState = JSON.parse(localStorage.getItem('notesAppState'));
        if (savedState) {
            // Restore the current note
            noteTitle.value = savedState.currentTitle || '';
            noteInput.value = savedState.currentNote || '';

            // Restore the saved notes
            if (savedState.savedNotes && savedState.savedNotes.length > 0) {
                savedState.savedNotes.forEach(note => {
                    restoreSavedNote(note.title, note.content);
                });
            }
        }
    }

    // Function to save the current state to localStorage
    function saveState() {
        const currentTitle = noteTitle.value;
        const currentNote = noteInput.value;

        const savedNotes = Array.from(savedNotesContainer.children).map(noteDiv => ({
            title: noteDiv.querySelector('.saved-note-title').textContent,
            content: noteDiv.querySelector('.saved-note-content').textContent,
        }));

        const state = {
            currentTitle,
            currentNote,
            savedNotes
        };

        localStorage.setItem('notesAppState', JSON.stringify(state));
    }

    // Function to restore a saved note
    function restoreSavedNote(title, content) {
        const savedNote = document.createElement('div');
        savedNote.className = 'saved-note';

        const savedTitle = document.createElement('div');
        savedTitle.className = 'saved-note-title';
        savedTitle.textContent = title;

        const savedContent = document.createElement('div');
        savedContent.className = 'saved-note-content'; // Added class for content div
        savedContent.style.display = 'none';
        savedContent.textContent = content;

        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';

        // Attach delete functionality
        deleteButton.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent the parent div's click event
            savedNotesContainer.removeChild(savedNote);
            saveState(); // Save state after deleting a note
        });

        // Append title, content, and delete button to the saved note div
        savedNote.appendChild(savedTitle);
        savedNote.appendChild(savedContent);
        savedNote.appendChild(deleteButton);

        savedNote.style.position = 'relative'; // Make sure the note is positioned relatively so that the delete button is placed correctly

        savedNote.addEventListener('click', function() {
            // Save the current note before switching
            saveCurrentNote();

            // Load the selected note
            noteTitle.value = savedTitle.textContent;
            noteInput.value = savedContent.textContent;

            // Remove the note from the saved list
            savedNotesContainer.removeChild(savedNote);

            saveState(); // Save the updated state
        });

        savedNotesContainer.appendChild(savedNote);
    }

    // Initialize the app and load the saved state
        loadSavedState(); // Load the state when the document is ready

    // Clear notes button functionality
    clearNotesButton.addEventListener('click', function() {
        noteTitle.value = ''; // Clear the title
        noteInput.value = ''; // Clear the text area
        saveState(); // Save state after clearing notes
    });

    // New page button functionality
    newPageButton.addEventListener('click', function() {
        saveCurrentNote(); // Save the current note
        noteTitle.value = ''; // Clear the title for a new note
        noteInput.value = ''; // Clear the text area for a new note
        saveState(); // Save state after clearing for a new note
    });

    // Update saveCurrentNote function to save state after adding a new note
    function saveCurrentNote() {
        if (noteTitle.value || noteInput.value) {
            restoreSavedNote(noteTitle.value || 'Untitled', noteInput.value);
            saveState(); // Save state after adding a new note
        }
    }
})();
