// Category functionality to bookmark
// Search & update functionality
// File system functionality

import express from 'express';
import cors from 'cors';

import { getAllBookMarks, createBookMark, deleteBookMarkById, updateBookMarkById } from './routes/bookmark.js';
const app = express();

app.use(cors());
app.use(express.json());

let bookmarks = [];

app.get('/bookmarks', getAllBookMarks);

app.post('/bookmarks', createBookMark);

app.delete('/bookmarks/:id', deleteBookMarkById);

app.put('/bookmarks/:id', updateBookMarkById);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
