const express = require('express');
const mongoose = require('mongoose');
const server = '127.0.0.1:27017'; // REPLACE WITH YOUR DB SERVER
const database = 'contact';      // REPLACE WITH YOUR DB NAME
const User = require('./models/user');


const app = express();
// Middleware to parse JSON requests
app.use(express.json());


class Database {
    constructor() {
        this._connect()
    }

    _connect() {
        mongoose.connect(`mongodb://${server}/${database}`)
        .then(() => {
            console.log('Database connection successful')
        })
        .catch(err => {
            console.error('Database connection error', err)
        })
    }
}
module.exports = new Database()


// GET: Return all users
app.get('/user', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
        } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
        }
    });
    
    // POST: Add a new user to the database
app.post('/user', async (req, res) => {
        try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.json(savedUser);
        } catch (error) {
        res.status(400).json({ error: 'Error creating user' });
        }
    });

    // PUT: Edit a user by ID
app.put('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedUser);
        } catch (error) {
        res.status(400).json({ error: 'Error updating user' });
        }
    });
    
    // DELETE: Remove a user by ID
app.delete('/user/:id', async (req, res) => {
        const { id } = req.params;
        try {
        await User.findByIdAndDelete(id);
        res.json({ message: 'User deleted successfully' });
        } catch (error) {
        res.status(400).json({ error: 'Error deleting user' });
        }
    });


const port = 3000;

    // Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});