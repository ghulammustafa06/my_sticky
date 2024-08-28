const notesContainer = document.getElementById('notes-container');
const createNoteButton = document.getElementById('create-note');

let notes = JSON.parse(localStorage.getItem('notes')) || [];

function createNote(content = '', color = '#fff700', x = 0, y = 0) {
    const note = document.createElement('div');
    note.className = 'note';
    note.style.backgroundColor = color;
    note.style.left = `${x}px`;
    note.style.top = `${y}px`;

    note.innerHTML = `
        <div class="note-content" contenteditable="true">${content}</div>
        <div class="note-actions">
            <button class="color-change"><i class="fas fa-palette"></i></button>
            <button class="delete-note"><i class="fas fa-trash"></i></button>
        </div>
    `;

    noteContent.addEventListener('input', saveNotes);
    colorChangeButton.addEventListener('click', () => changeColor(note));
    deleteButton.addEventListener('click', () => deleteNote(note));

    saveNotes();
}
