const { Client } = require('pg');
const connectionConfig = {
    host: 'localhost',
    user: 'postgres',
    password: '*****',
    database: 'nodejs-learning'
};

async function addMovie() {
    const client = new Client(connectionConfig);
    await client.connect();

    const query = `
        INSERT INTO movies (title, genre, release_year, director, duration, description, rating)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
    const values = [
        'Inception',
        'Sci-Fi',
        2010,
        'Christopher Nolan',
        148,
        'A thief who steals corporate secrets through the use of dream-sharing technology.',
        8.8
    ];

    try {
        const res = await client.query(query, values);
        console.log('Movie added:', res.rows[0]);
    } catch (error) {
        console.error('Error adding movie:', error);
    } finally {
        await client.end();
    }
}

addMovie();

