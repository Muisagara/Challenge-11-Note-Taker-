const util = require('util');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Store {
  async read() {
    try {
      const notes = await readFileAsync('db/db.json', 'utf8');
      return JSON.parse(notes) || [];
    } catch (error) {
      return [];
    }
  }

  async write(notes) {
    await writeFileAsync('db/db.json', JSON.stringify(notes));
  }

  async getNotes() {
    try {
      const notes = await this.read();
      return notes;
    } catch (error) {
      return [];
    }
  }

  async addNote(note) {
    const { title, text } = note;
    if (!title || !text) {
      throw new Error("Note 'title' and 'text' cannot be blank");
    }

    const newNote = { title, text, id: uuidv4() };
    const notes = await this.getNotes();
    const updatedNotes = [...notes, newNote];
    await this.write(updatedNotes);
    return newNote;
  }

  async removeNote(id) {
    const notes = await this.getNotes();
    const filteredNotes = notes.filter((note) => note.id !== id);
    await this.write(filteredNotes);
  }
}

module.exports = new Store();
