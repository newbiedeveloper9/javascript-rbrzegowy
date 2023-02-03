var notes = JSON.parse(localStorage.getItem('notes')) || [];

const addNote = () => {
    var title = document.getElementById('title').value
    var description = document.getElementById('description').value
    var color = document.getElementById('color').value

    console.log({ title: title, description: description, date: Date.now(), color: color, id: Math.max(...notes.map(o => o.id + 1)), pinned: false })
    notes.push({ title: title, description: description, date: Date.now(), color: color, id: Math.max(...notes.map(o => o.id + 1)), pinned: false });
    localStorage.setItem('notes', JSON.stringify(notes));
    renderTree();
}

function removeNote(id) {
    notes = notes.filter(function (value, index, arr) {
        return value.id !== id;
    });
    localStorage.setItem('notes', JSON.stringify(notes));
    renderTree();
}

function pinNote(id) {
    var note = notes.find(x => x.id === id);
    note.pinned = !note.pinned
    localStorage.setItem('notes', JSON.stringify(notes));
    renderTree();
}

function renderTree() {
    var list = document.getElementById('list-handle');
    var pinnedList = document.getElementById('pinned-list-handle');
    list.innerHTML = "";
    pinnedList.innerHTML = "";
    notes.forEach(note => {
        var noteHtml = renderNote(note)
        if (note.pinned) {
            pinnedList.innerHTML += noteHtml
        }
        else {
            list.innerHTML += noteHtml
        }
    })
}

function renderNote(note) {
    return `        
    <div class="note" style="background-color:${note.color}">
        <div>
            <h3>${note.title}</h3>
        </div>
        <p>${note.description}</p>
        <p>${new Date(note.date).toISOString()}</p>
        <div>
            ${note.pinned}
            <input type="button" value="X" onclick="removeNote(${note.id})">
            <input type="button" value="Pin" onclick="pinNote(${note.id})">
        </div>
    </div>`
}

document.addEventListener('DOMContentLoaded', async () => {
    renderTree();
});