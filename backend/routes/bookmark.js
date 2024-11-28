let bookmarks = [];
let currentId = 1;

export async function getAllBookMarks(req, res) {
    res.json(bookmarks);
}

export async function createBookMark(req, res) {
    const { uri } = req.body;
    if(!uri) {
        return res.status(400).json({
            error: 'URL to add bookmark is required'
        });
    }

    const newBookMark = {
        id: currentId++,
        uri: uri
    };

    bookmarks.push(newBookMark);
    res.status(201).json(newBookMark);
}

export async function deleteBookMarkById(req, res) {
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id == id);

    if(bookmarkIndex !== -1) {
        bookmarks.splice(bookmarkIndex, 1);
        res.status(204).send();
    }
    else {
        res.status(404).json({ error: 'Bookmark not found'});
    }
}

export async function updateBookMarkById(req, res) {
    const { id } = req.params;
    const { uri } = req.body;

    if(!uri) {
        return res.status(400).json({ error: "Bookmark url is required for updation" });
    }

    const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id == id);
    
    if(bookmarkIndex !== -1) {
        bookmarks[bookmarkIndex] = { ...bookmarks[bookmarkIndex], uri};
        res.status(200);
        res.json(bookmarks[bookmarkIndex]);
    }
    else {
        res.status(404).json({ error: 'Bookmark not found' });
    }
}