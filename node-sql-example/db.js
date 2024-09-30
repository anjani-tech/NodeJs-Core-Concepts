const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    const query = `CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    releaseYear INTEGER NOT NULL
  )`;

    db.run(query, (error) => {
        if (error) {
            console.error(`Error creating table: ${error.message}`);
        } else {
            console.log(`Table 'movies' created successfully`);
        }
    });
});

module.exports = db;
