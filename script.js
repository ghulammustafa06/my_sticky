const notesContainer = document.getElementById('notes-container');
const createNoteButton = document.getElementById('create-note');
const searchInput = document.getElementById('search-notes');
const templatesModal = document.getElementById('templates-modal');
const closeModalButton = document.getElementById('close-modal');

let notes = JSON.parse(localStorage.getItem('notes')) || [];

function createNote(content = '', color = '#fff700', x = 0, y = 0, template = '') {
    const note = document.createElement('div');
    note.className = 'note';
    note.style.backgroundColor = color;
    note.style.left = `${x}px`;
    note.style.top = `${y}px`;

    let templateContent = '';
    if (template === 'todo') {
        templateContent = '<h3>To-Do List</h3><ul><li>Task 1</li><li>Task 2</li><li>Task 3</li></ul>';
    } else if (template === 'meeting') {
        templateContent = '<h3>Meeting Notes</h3><p>Date: </p><p>Attendees: </p><p>Agenda: </p><p>Action Items: </p>';
    } else if (template === 'idea') {
        templateContent = '<h3>Idea Brainstorm</h3><p>Main Concept: </p><p>Potential Benefits: </p><p>Challenges: </p><p>Next Steps: </p>';
    }

    note.innerHTML = `
        <div class="note-content" contenteditable="true">${content || templateContent}</div>
        <div class="note-actions">
            <button class="color-change"><i class="fas fa-palette"></i></button>
            <button class="format-note"><i class="fas fa-font"></i></button>
            <button class="delete-note"><i class="fas fa-trash"></i></button>
        </div>
    `;

    notesContainer.appendChild(note);
    
    note.style.animation = 'fadeIn 0.5s';

    // Make the note draggable
    note.draggable = true;
    note.addEventListener('dragstart', dragStart);
    note.addEventListener('dragend', dragEnd);

    // Add event listeners for editing, color change, formatting, and deletion
    const noteContent = note.querySelector('.note-content');
    const colorChangeButton = note.querySelector('.color-change');
    const formatButton = note.querySelector('.format-note');
    const deleteButton = note.querySelector('.delete-note');

    noteContent.addEventListener('input', saveNotes);
    colorChangeButton.addEventListener('click', () => changeColor(note));
    formatButton.addEventListener('click', () => formatNote(noteContent));
    deleteButton.addEventListener('click', () => deleteNote(note));

    saveNotes();
}

createNoteButton.addEventListener('click', showTemplatesModal);

function showTemplatesModal() {
    templatesModal.style.display = 'block';
}

closeModalButton.addEventListener('click', () => {
    templatesModal.style.display = 'none';
});

document.querySelectorAll('.template').forEach(template => {
    template.addEventListener('click', () => {
        createNote('', '#fff700', 0, 0, template.dataset.template);
        templatesModal.style.display = 'none';
    });
});

function changeColor(note) {
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = note.style.backgroundColor;
    colorPicker.click();

    colorPicker.addEventListener('change', () => {
        note.style.backgroundColor = colorPicker.value;
        saveNotes();
    });
}

function formatNote(noteContent) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        if (selectedText) {
            const formatOptions = ['bold', 'italic', 'underline'];
            const randomFormat = formatOptions[Math.floor(Math.random() * formatOptions.length)];
            
            const formattedText = document.createElement('span');
            formattedText.style[randomFormat] = true;
            formattedText.textContent = selectedText;

            range.deleteContents();
            range.insertNode(formattedText);
        }
    }
    saveNotes();
}

function deleteNote(note) {
    note.style.animation = 'fadeOut 0.5s';
    setTimeout(() => {
        note.remove();
        saveNotes();
    }, 500);
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

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    document.querySelectorAll('.note').forEach(note => {
        const noteContent = note.querySelector('.note-content').textContent.toLowerCase();
        note.style.display = noteContent.includes(searchTerm) ? 'flex' : 'none';
    });
});

loadNotes();

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        showTemplatesModal();
    }
});

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(20px); }
    }
`;
document.head.appendChild(style);