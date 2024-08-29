const notesContainer = document.getElementById('notes-container');
const createNoteButton = document.getElementById('create-note');
const searchInput = document.getElementById('search-notes');
const categoryFilter = document.getElementById('category-filter');
const templatesModal = document.getElementById('templates-modal');
const closeModalButton = document.getElementById('close-modal');
const toggleDarkModeButton = document.getElementById('toggle-dark-mode');

let notes = JSON.parse(localStorage.getItem('notes')) || [];
let isDarkMode = localStorage.getItem('darkMode') === 'true';

function createNote(content = '', color = '#fff700', textColor = '#000000', x = 0, y = 0, width = '250px', height = '250px', template = '', category = '') {
    const note = document.createElement('div');
    note.className = 'note';
    note.style.backgroundColor = color;
    note.style.color = textColor;
    note.style.left = `${x}px`;
    note.style.top = `${y}px`;
    note.style.width = width;
    note.style.height = height;

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
            <button class="text-color-change"><i class="fas fa-font"></i></button>
            <button class="format-note"><i class="fas fa-heading"></i></button>
            <button class="change-category"><i class="fas fa-tag"></i></button>
            <button class="delete-note"><i class="fas fa-trash"></i></button>
        </div>
        <div class="category-tag category-${category}">${category}</div>
    `;

    notesContainer.appendChild(note);
    
    note.style.animation = 'fadeIn 0.5s';

    note.draggable = true;
    note.addEventListener('dragstart', dragStart);
    note.addEventListener('dragend', dragEnd);

    note.style.resize = 'both';
    note.style.overflow = 'auto';


    const noteContent = note.querySelector('.note-content');
    const colorChangeButton = note.querySelector('.color-change');
    const textColorChangeButton = note.querySelector('.text-color-change');
    const formatButton = note.querySelector('.format-note');
    const changeCategoryButton = note.querySelector('.change-category');
    const deleteButton = note.querySelector('.delete-note');

    noteContent.addEventListener('input', saveNotes);
    colorChangeButton.addEventListener('click', () => changeColor(note));
    textColorChangeButton.addEventListener('click', () => changeTextColor(note));
    formatButton.addEventListener('click', () => showFormatOptions(noteContent));
    changeCategoryButton.addEventListener('click', () => changeCategory(note));
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
        createNote('', '#fff700', '#000000', 0, 0, '250px', '250px', template.dataset.template);
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

function changeTextColor(note) {
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = note.style.color;
    colorPicker.click();

    colorPicker.addEventListener('change', () => {
        note.style.color = colorPicker.value;
        saveNotes();
    });
}

function showFormatOptions(noteContent) {
    const formatOptions = ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript'];
    const formatMenu = document.createElement('div');
    formatMenu.className = 'format-menu';
    formatMenu.style.position = 'absolute';
    formatMenu.style.backgroundColor = 'var(--bg-color)';
    formatMenu.style.border = '1px solid var(--primary-color)';
    formatMenu.style.borderRadius = '5px';
    formatMenu.style.padding = '5px';

    formatOptions.forEach(option => {
        const button = document.createElement('button');
        button.innerHTML = `<i class="fas fa-${option}"></i>`;
        button.addEventListener('click', () => {
            document.execCommand(option, false, null);
            formatMenu.remove();
            saveNotes();
        });
        formatMenu.appendChild(button);
    });

    noteContent.parentNode.appendChild(formatMenu);
}

function changeCategory(note) {
    const categories = ['work', 'personal', 'ideas'];
    const currentCategory = note.querySelector('.category-tag').textContent;
    const newCategory = categories[(categories.indexOf(currentCategory) + 1) % categories.length];
    note.querySelector('.category-tag').textContent = newCategory;
    note.querySelector('.category-tag').className = `category-tag category-${newCategory}`;
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
    const gridSize = 20;
    const newX = Math.round(e.clientX / gridSize) * gridSize;
    const newY = Math.round(e.clientY / gridSize) * gridSize;
    e.target.style.left = `${newX}px`;
    e.target.style.top = `${newY}px`;
    saveNotes();
}

function saveNotes() {
    const notesData = Array.from(document.querySelectorAll('.note')).map(note => ({
        content: note.querySelector('.note-content').innerHTML,
        color: note.style.backgroundColor,
        textColor: note.style.color,
        x: parseInt(note.style.left, 10),
        y: parseInt(note.style.top, 10),
        width: note.style.width,
        height: note.style.height,
        category: note.querySelector('.category-tag').textContent
    }));
    localStorage.setItem('notes', JSON.stringify(notesData));
}

function loadNotes() {
    notes.forEach(note => {
        createNote(note.content, note.color, note.textColor, note.x, note.y, note.width, note.height, '', note.category);
    });
}

searchInput.addEventListener('input', filterNotes);
categoryFilter.addEventListener('change', filterNotes);

function filterNotes() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    document.querySelectorAll('.note').forEach(note => {
        const noteContent = note.querySelector('.note-content').textContent.toLowerCase();
        const noteCategory = note.querySelector('.category-tag').textContent;
        const matchesSearch = noteContent.includes(searchTerm);
        const matchesCategory = selectedCategory === '' || noteCategory === selectedCategory;

        note.style.display = matchesSearch && matchesCategory ? 'flex' : 'none';
    });
}

toggleDarkModeButton.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
});

if (isDarkMode) {
    document.body.classList.add('dark-mode');
}

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        showTemplatesModal();
    }
});

loadNotes();