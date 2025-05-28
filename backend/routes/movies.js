const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Movie = require('../models/Movie');
const { auth, isAdmin } = require('../middleware/auth');

// Get all movies with filtering and pagination
router.get('/', async (req, res) => {
    try {
        const { genre, year, sort, page = 1, limit = 10 } = req.query;
        const query = {};

        // Apply filters
        if (genre) query.genre = genre;
        if (year) query.releaseYear = year;

        // Apply sorting
        let sortOption = {};
        if (sort === 'rating') sortOption = { averageRating: -1 };
        else if (sort === 'year') sortOption = { releaseYear: -1 };
        else sortOption = { createdAt: -1 };

        const movies = await Movie.find(query)
            .sort(sortOption)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('reviews');

        const count = await Movie.countDocuments(query);

        res.json({
            movies,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single movie
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id)
            .populate('reviews');
        
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create movie (admin only)
router.post('/', [auth, isAdmin], [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('releaseYear').isInt({ min: 1900, max: new Date().getFullYear() }),
    body('genre').isArray(),
    body('director').trim().notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const movie = new Movie(req.body);
        await movie.save();
        res.status(201).json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update movie (admin only)
router.put('/:id', [auth, isAdmin], async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete movie (admin only)
router.delete('/:id', [auth, isAdmin], async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add to favorites
router.post('/:id/favorite', auth, async (req, res) => {
    try {
        const user = req.user;
        const movieId = req.params.id;

        if (user.favorites.includes(movieId)) {
            return res.status(400).json({ message: 'Movie already in favorites' });
        }

        user.favorites.push(movieId);
        await user.save();

        res.json({ message: 'Added to favorites' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove from favorites
router.delete('/:id/favorite', auth, async (req, res) => {
    try {
        const user = req.user;
        const movieId = req.params.id;

        user.favorites = user.favorites.filter(id => id.toString() !== movieId);
        await user.save();

        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 