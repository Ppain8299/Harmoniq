const express = require('express');
const cors = require('cors');
const { pool, initializeDatabase } = require('./db/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS from environment for flexibility in different deployments
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Initialize database when starting server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

// API endpoint to list songs
app.get('/api/songs', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT song_id as id, song_name as name, song_path as path
      FROM songs 
      ORDER BY song_name
    `);

    const songs = result.rows.map(song => ({
      id: song.id,
      name: song.name,
      path: song.path
    }));

    res.json(songs);

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch songs',
      details: err.message 
    });
  }
});

// Static file streaming for audio by id
const fs = require('fs');
const path = require('path');

app.get('/api/songs/:id/file', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT song_path FROM songs WHERE song_id = $1', 
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).send('Song not found');
    }

    const filePath = result.rows[0].song_path;

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('Audio file not found');
    }

    res.sendFile(path.resolve(filePath));
    
  } catch (err) {
    console.error('File serve error:', err);
    res.status(500).send('Error serving audio file');
  }
});