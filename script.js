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

    notesContainer.appendChild(note);
    
    note.draggable = true;
    note.addEventListener('dragstart', dragStart);
    note.addEventListener('dragend', dragEnd);

    const noteContent = note.querySelector('.note-content');
    const colorChangeButton = note.querySelector('.color-change');
    const deleteButton = note.querySelector('.delete-note');

    noteContent.addEventListener('input', saveNotes);
    colorChangeButton.addEventListener('click', () => changeColor(note));
    deleteButton.addEventListener('click', () => deleteNote(note));

    saveNotes();
}

createNoteButton.addEventListener('click', () => createNote());

function changeColor(note) {
    const colors = ['#fff700', '#ff7eb9', '#7afcff', '#feff9c', '#fff'];
    const currentColor = note.style.backgroundColor;
    const currentIndex = colors.indexOf(currentColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    note.style.backgroundColor = colors[nextIndex];
    saveNotes();
}

function deleteNote(note) {
    note.remove();
    saveNotes();
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => (e.target.style.opacity = '0.5'), 0);
}

function dragEnd(e) {
    e.target.style.opacity = '1';
    e.target.style.left = `${e.clientX - e.target.offsetWidth / 2}px`;
    e.target.style.top = `${e.clientY - e.target.offsetHeight / 2}px`;
    saveNotes();
}

function saveNotes() {
    const notesData = Array.from(document.querySelectorAll('.note')).map(note => ({
        content: note.querySelector('.note-content').innerHTML,
        color: note.style.backgroundColor,
        x: parseInt(note.style.left, 10),
        y: parseInt(note.style.top, 10)
    }));
    localStorage.setItem('notes', JSON.stringify(notesData));
}

function loadNotes() {
    notes.forEach(note => createNote(note.content, note.color, note.x, note.y));
}

loadNotes();