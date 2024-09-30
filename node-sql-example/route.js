const express = require('express');
const db = require('./db');
const router = express.Router();

router.post('/movies', (req, res) => {
    const { title, description, releaseYear } = req.body;
    const query = `INSERT INTO movies (title, description, releaseYear) VALUES (?, ?, ?)`;
    db.run(query, [title, description, releaseYear], function (error) {
        if (error) {
            return res.status(500).json({ error: 'Failed to insert movie' });
        }

        const lastID = this.lastID;

        db.get('SELECT * FROM movies WHERE id = ?', [lastID], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to retrieve inserted movie details' });
            }
            console.log(`Movie added with ID: ${lastID}`);
            res.status(201).json({ message: 'Movie added successfully', movie: row });
        });
    });
});


router.get('/movies', (req, res) => {
    const { page = 1, limit = 10, sortBy = 'releaseYear', sortOrder = 'ASC' } = req.query;
    const offset = (page - 1) * limit;
    
    const validSortOrders = ['ASC', 'DESC'];
    const order = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';
  
    const query = `SELECT * FROM movies ORDER BY ${sortBy} ${order} LIMIT ? OFFSET ?`;
  
    db.all(query, [limit, offset], (error, rows) => {
      if (error) {
        console.error(`Error fetching movies: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch movies' });
      } else {
        res.json(rows);
      }
    });
  });
  

router.get('/movies/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM movies WHERE id = ?`;
    db.get(query, [id], function (error, row) {
        if (error) {
            return res.status(500).json({ error: `Failed to retrieve movie id: ${id}` });
        }
        if (!row) {
            return res.status(404).json({
                message: `No movie Found with id: ${id}`
            })
        }
        res.status(200).json({
            message: `Movie fetched successfully`,
            data: row
        })
    })
});


router.put('/movies/:id', (req, res) => {
    const { id } = req.params;
    const query = `UPDATE movies SET title =? , description = ? , releaseYear= ? WHERE id = ?`;
    db.run(query, [title, description, releaseYear, id], function (error) {
        if (error) {
            return res.status(500).json({ error: `Failed to retrieve movie id: ${id}` });
        }
        res.status(201).json({
            message: `Movie updated successfully`,
            data: this.changes
        })
    })
});


router.delete('/movies', (req, res) => {
    const query = `DELETE FROM movies`;
    db.run(query, function (error) {
        if (error) {
            return res.status(500).json({ error: `Failed to delete all movies` });
        }
        res.status(201).json({
            message: `Movie PURGED successfully`
        })
    })
});


router.delete('/movies/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM movies where id = ?`;
    db.run(query, [id], function (error) {
        if (error) {
            return res.status(500).json({ error: `Failed to movie: ${id}` });
        }
        res.status(201).json({
            message: `Movie ${id} PURGED successfully`
        })
    })
});


module.exports = router;
