const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'gameadmin',
    host: 'localhost',
    database: 'porsche911game',
    password: 'porsche911dash',
    port: 5434,
});

// Get top 10 scores
app.get('/api/leaderboard', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT player_name, score, time_survived, created_at FROM leaderboard ORDER BY score DESC LIMIT 10'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

// Submit a score
app.post('/api/leaderboard', async (req, res) => {
    const { player_name, score, time_survived } = req.body;
    
    if (!player_name || score === undefined || time_survived === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Sanitize player name (max 20 chars, alphanumeric + spaces)
    const cleanName = player_name.slice(0, 20).replace(/[^a-zA-Z0-9 ]/g, '');
    
    try {
        const result = await pool.query(
            'INSERT INTO leaderboard (player_name, score, time_survived) VALUES ($1, $2, $3) RETURNING *',
            [cleanName, score, time_survived]
        );
        
        // Get rank
        const rankResult = await pool.query(
            'SELECT COUNT(*) + 1 as rank FROM leaderboard WHERE score > $1',
            [score]
        );
        
        res.json({ 
            success: true, 
            entry: result.rows[0],
            rank: parseInt(rankResult.rows[0].rank)
        });
    } catch (err) {
        console.error('Error submitting score:', err);
        res.status(500).json({ error: 'Failed to submit score' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'porsche911-leaderboard' });
});

// GET submit endpoint (image beacon, bypasses Cloudflare)
app.get('/api/submit', async (req, res) => {
    const { name, score, time } = req.query;
    
    if (!name || !score || !time) {
        res.type('image/gif');
        return res.send(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
    }
    
    const cleanName = String(name).slice(0, 20).replace(/[^a-zA-Z0-9 ]/g, '') || 'Anonymous';
    const scoreNum = parseInt(score) || 0;
    const timeNum = parseInt(time) || 0;
    
    try {
        await pool.query(
            'INSERT INTO leaderboard (player_name, score, time_survived) VALUES ($1, $2, $3)',
            [cleanName, scoreNum, timeNum]
        );
    } catch (err) {
        console.error('Error submitting score:', err);
    }
    
    // Return 1x1 transparent GIF
    res.type('image/gif');
    res.send(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
});

// JSONP endpoint for script tag loading (bypasses Cloudflare)
app.get('/api/leaderboard.js', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT player_name, score, time_survived, created_at FROM leaderboard ORDER BY score DESC LIMIT 10'
        );
        res.type('application/javascript');
        res.send(`window.LEADERBOARD_DATA = ${JSON.stringify(result.rows)};`);
    } catch (err) {
        res.type('application/javascript');
        res.send('window.LEADERBOARD_DATA = [];');
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Leaderboard API running on port ${PORT}`);
});
