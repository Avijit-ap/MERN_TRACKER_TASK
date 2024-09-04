// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Todo Model
const Todo = mongoose.model('Todo', new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false }
}));

// CRUD Routes
app.post('/todos', async (req, res) => {
    const todo = new Todo(req.body);
    await todo.save();
    res.status(201).send(todo);
});

app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.send(todos);
});

app.put('/todos/:id', async (req, res) => {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(todo);
});

app.delete('/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});