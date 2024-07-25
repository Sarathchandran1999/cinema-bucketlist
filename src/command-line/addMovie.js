const axios = require('axios');
const io = require('socket.io-client');

// Connect to the Node.js server
const socket = io('http://localhost:8000');

// Function to add a movie
const addMovie = async (movie) => {
    try {
        // Add the movie to the Node.js server
        await axios.post('http://localhost:8000/api/v1/add-cinema', { cinema: movie });

        // Notify clients about the update
        socket.emit('updateMovies');
        console.log('Movie added and clients notified');
    } catch (error) {
        console.error('Error adding movie:', error);
    }
};

// Get movie from command line arguments
const movie = process.argv.slice(2)[0];
if (movie) {
    addMovie(movie);
} else {
    console.log('Please provide a movie name.');
}
