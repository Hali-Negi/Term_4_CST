// Student Name: Hali Imanpanah
// Student ID: A01424306
// AI was used for guidance, explanations, and debugging assistance.

class Note {
  constructor(content = "") {
    this.content = content;

    this.noteContainer = document.createElement("div");

    this.textArea = document.createElement("textarea");
    this.textArea.value = this.content;

    this.removeButton = document.createElement("button");
    this.removeButton.textContent = REMOVE_MESSAGE;

    this.removeButton.addEventListener("click", () => {
      this.remove();
    });
  }

  // behaviour of the note
  render(container) {
    if (container === notesContainer) {
      // Put textarea and remove button inside one note container
      this.noteContainer.appendChild(this.textArea);
      this.noteContainer.appendChild(this.removeButton);

      // Display the note container on the Writer page
      container.appendChild(this.noteContainer);
    }

    if (container === readerNotes) {
      // Make textarea read-only on Reader
      this.textArea.readOnly = true;

      // Display textarea on Reader
      container.appendChild(this.textArea);
    }
  }

  // behaviour of the note
  remove() {
    // finds the index of the note
    const index = notes.indexOf(this);

    // splice(startPosition, numberToRemove)
    // removes Note from the array
    notes.splice(index, 1);

    // removes the whole note container from the webpage
    this.noteContainer.remove();

    // immediately updates localStorage
    // forces a save instead of waiting for the next 2-second interval
    saveNotes();
  }
}

const notes = [];

// Find the HTML element whose ID is notes-container and keep a reference to it in notesContainer
const notesContainer = document.getElementById("notes-container");
// Find the HTML element whose ID is stored-time and keep a reference to it in storedTime
const storedTime = document.getElementById("stored-time");

// Find the HTML element whose ID is reader-notes and keep a reference to it in readerNotes
const readerNotes = document.getElementById("reader-notes");
// Find the HTML element whose ID is retrieved-time and keep a reference to it in retrievedTime
const retrievedTime = document.getElementById("retrieved-time");

const addButton = document.createElement("button");
addButton.textContent = ADD_NOTE_MESSAGE;

if (notesContainer) {
  notesContainer.appendChild(addButton);

  addButton.addEventListener("click", () => {
    const note = new Note();

    //keeps the object in our JavaScript array.
    notes.push(note);

    //displays that object's textarea and button on the webpage.
    note.render(notesContainer);

    // moves the Add button below the new note.
    notesContainer.appendChild(addButton);
  });
}

// notes array, convert to JSON, save to localStorage
// prepare notes, save notes to localStorage, get current time, display current time
function saveNotes() {
  const data = notes.map((note) => ({ content: note.textArea.value }));

  // Convert data to JSON and save it
  // JSON.stringify(data) converts it to text that localStorage can store.
  localStorage.setItem("notes", JSON.stringify(data)); // PUT notes into storage

  // Get the current time, toLocaleTimeString: takes only the time and makes it readable like 12:18:45 AM
  const time = STORED_AT_MESSAGE + new Date().toLocaleTimeString();

  // Display the current time
  storedTime.textContent = time;
}

// It prevents Writer-specific code from running on the Reader page.
if (notesContainer) {
  const savedNotes = localStorage.getItem("notes"); // GET notes from storage

  // convert JSON to JavaScript object
  // If there are no saved notes, use an empty array instead.
  const parsedNotes = JSON.parse(savedNotes) || [];

  // Go through each saved note
  for (const savedNote of parsedNotes) {
    // ex: const note = new Note("Hello"); Create a new Note with saved content
    const note = new Note(savedNote.content);

    // Add the Note to the notes array
    notes.push(note);

    // Display the Note on the page
    note.render(notesContainer);
  }

  // moves the Add button below all loaded notes.
  notesContainer.appendChild(addButton);

  // Save notes every 2 seconds
  setInterval(saveNotes, 2000);
}

// saveNotes()     = FUNCTION that saves all notes
// savedNotes      = DATA retrieved from localStorage
// savedNote       = ONE note inside the loop

function loadRenderedNotes() {
  // Get notes from localStorage
  const savedNotes = localStorage.getItem("notes");
  // Convert JSON string to JavaScript object
  const parsedNotes = JSON.parse(savedNotes) || [];

  // Clear old notes from Reader
  readerNotes.innerHTML = "";

  // Render all notes, Display each saved note
  for (const savedNote of parsedNotes) {
    const note = new Note(savedNote.content);
    note.render(readerNotes);
  }

  // Get the current retrieval time
  const time = RETRIEVED_AT_MESSAGE + new Date().toLocaleTimeString();
  // Display the current retrieval time
  retrievedTime.textContent = time;
}

// If we're on the Reader page and readerNotes exists,load and display the saved notes.
if (readerNotes) {
  // Load notes immediately
  loadRenderedNotes();

  // setInterval() tells JavaScript to repeat a function after a fixed amount of time.
  // Load notes every 2 seconds
  setInterval(loadRenderedNotes, 2000);
}

// Part 2 - Question 1
// Can Writer and Reader share localStorage in different tabs of the same browser?
// Yes. Tabs using the same browser and origin share the same localStorage.

// Part 2 - Question 2
// Can Writer and Reader share localStorage in different browsers?
// No. Different browsers have separate localStorage.
