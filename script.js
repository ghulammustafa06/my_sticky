const notesContainer = document.getElementById('notes-container');
const createNoteButton = document.getElementById('create-note');
const searchInput = document.getElementById('search-notes');
const categoryFilter = document.getElementById('category-filter');
const templatesModal = document.getElementById('templates-modal');
const closeModalButton = document.getElementById('close-modal');
const toggleDarkModeButton = document.getElementById('toggle-dark-mode');
const showShortcutGuideButton = document.getElementById('show-shortcut-guide');
const shortcutGuideModal = document.getElementById('shortcut-guide');
const closeShortcutGuideButton = document.getElementById('close-shortcut-guide');

let notes = JSON.parse(localStorage.getItem('notes')) || [];
let isDarkMode = localStorage.getItem('darkMode') === 'true';

function createNote(content = '', color = '#fff700', x = 0, y = 0, template = '', category = '', width = '250px', height = '250px', textColor = '#000000') {
    const note = document.createElement('div');
    note.className = 'note';
    note.style.backgroundColor = color;
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
        <div class="note-content" contenteditable="true" style="color: ${textColor}">${content || templateContent}</div>
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
    textColorChangeButton.addEventListener('click', () => changeTextColor(noteContent));
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
        createNote('', '#fff700', 0, 0, template.dataset.template, 'work');
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

function changeTextColor(noteContent) {
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = noteContent.style.color;
    colorPicker.click();

    colorPicker.addEventListener('change', () => {
        noteContent.style.color = colorPicker.value;
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

function changeFontSize(noteContent, change) {
    const currentSize = window.getComputedStyle(noteContent, null).getPropertyValue('font-size');
    const newSize = parseInt(currentSize) + change;
    noteContent.style.fontSize = `${newSize}px`;
    saveNotes();
}

function changeCategory(note) {
    const categories = ['work', 'personal', 'ideas'];
    const currentCategory = note.querySelector('.category-tag').textContent;
    const newCategoryIndex = (categories.indexOf(currentCategory) + 1) % categories.length;
    const newCategory = categories[newCategoryIndex];

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
    e.target.style.opacity = '0.5';
}

function dragEnd(e) {
    e.target.style.opacity = '1';
    saveNotes();
}

notesContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
});

notesContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    const noteId = e.dataTransfer.getData('text');
    const note = document.getElementById(noteId);
    note.style.left = `${e.clientX - note.offsetWidth / 2}px`;
    note.style.top = `${e.clientY - note.offsetHeight / 2}px`;
});

function saveNotes() {
    notes = Array.from(notesContainer.children).map(note => ({
        content: note.querySelector('.note-content').innerHTML,
        color: note.style.backgroundColor,
        x: note.style.left,
        y: note.style.top,
        width: note.style.width,
        height: note.style.height,
        textColor: note.querySelector('.note-content').style.color,
        category: note.querySelector('.category-tag').textContent
    }));
    localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotes() {
    notes.forEach(note => createNote(note.content, note.color, note.x, note.y, '', note.category, note.width, note.height, note.textColor));
}

searchInput.addEventListener('input', filterNotes);
categoryFilter.addEventListener('change', filterNotes);

function filterNotes() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    Array.from(notesContainer.children).forEach(note => {
        const content = note.querySelector('.note-content').textContent.toLowerCase();
        const category = note.querySelector('.category-tag').textContent;
        const matchesSearch = content.includes(searchTerm);
        const matchesCategory = selectedCategory === '' || category === selectedCategory;
        note.style.display = matchesSearch && matchesCategory ? 'block' : 'none';
    });
}

toggleDarkModeButton.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
});

showShortcutGuideButton.addEventListener('click', () => {
    shortcutGuideModal.style.display = 'block';
});

closeShortcutGuideButton.addEventListener('click', () => {
    shortcutGuideModal.style.display = 'none';
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        showTemplatesModal();
    } else if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        searchInput.focus();
    } else if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleDarkModeButton.click();
    } else if (e.key === 'Escape') {
        templatesModal.style.display = 'none';
        shortcutGuideModal.style.display = 'none';
    }
});

loadNotes();
document.body.classList.toggle('dark-mode', isDarkMode);