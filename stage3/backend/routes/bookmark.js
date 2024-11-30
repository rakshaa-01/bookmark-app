let bookmarks = [];
let currentId = 1;

export async function getAllBookMarks(req, res) {
    res.json(bookmarks);
}

export async function createBookMark(req, res) {
    const { uri } = req.body;
    const { category } = req.body;
    if(!uri || !category) {
        console.error('URI/ category is empty!');
        return res.status(400).json({
            error: 'URL/category to add bookmark is required'
        });
    }

    const newBookMark = {
        id: currentId++,
        uri: uri,
        category: category
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
    let { category } = req.body;

    if(!uri || !category) {
        return res.status(400).json({ error: "Bookmark url/ category is required for updation" });
    }

    category = category.trim().replace(/^\(|\)$/g, '');

    const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id == id);
    
    if(bookmarkIndex !== -1) {
        bookmarks[bookmarkIndex] = { ...bookmarks[bookmarkIndex], uri, category};
        res.status(200);
        res.json(bookmarks[bookmarkIndex]);
    }
    else {
        res.status(404).json({ error: 'Bookmark not found' });
    }
}

// Search functionality
export async function searchBookmark(req, res) {
    const { q } = req.query;

    if(!q) {
        return res.status(400).json({ msg: "Query parameter missing" })
    }

    const filteredBookmarks = bookmarks.filter(bookmark => 
        bookmark.uri.toLowerCase().includes(q.toLowerCase()) ||
        bookmark.category.toLowerCase().includes(q.toLowerCase())
    );
    res.json(filteredBookmarks);
}