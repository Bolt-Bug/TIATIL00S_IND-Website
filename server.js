const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('.'));

// In-memory storage for scores (top 5)
let topScores = [];

// POST endpoint to receive score from Unity
app.post('/api/score', (req, res) => {
    try {
        const { score } = req.body;
        
        if (typeof score !== 'number' || !Number.isInteger(score)) {
            return res.status(400).json({ error: 'Score must be an integer' });
        }

        // Add score to array
        topScores.push(score);
        
        // Sort in descending order and keep top 5
        topScores.sort((a, b) => b - a);
        topScores = topScores.slice(0, 5);

        console.log(`Score received: ${score}`);
        console.log('Current top 5:', topScores);

        res.json({ 
            success: true, 
            message: 'Score submitted successfully',
            topScores: topScores
        });
    } catch (error) {
        console.error('Error processing score:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET endpoint to retrieve top 5 scores
app.get('/api/scores', (req, res) => {
    res.json(topScores);
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the leaderboard`);
});