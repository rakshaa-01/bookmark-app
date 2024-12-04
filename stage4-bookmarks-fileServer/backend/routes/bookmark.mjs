import fs from 'fs/promises';

const FILE_PATH = './bookmarks.json';

//getAllBookmarks()
export async function getAllBookMarks(req, res) {
    const bookmarks = await readBookmarks();
    res.json(bookmarks);
}

async function readBookmarks() {
    try {
        const data = await fs.readFile(FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch(err) {
        if(err.code === 'ENOENT') {
            await fs.writeFile(FILE_PATH, JSON.stringify([]));
            return [];
        }
        throw err;
    }
}

//createBookMark()
export async function createBookMark(req, res) {
    const { uri, category } = req.body;
    if(!uri || !category) {
        console.error('URI/ category is empty!');
        return res.status(400).json({
            error: 'URL/category to add bookmark is required'
        });
    }

    const bookmarks = await readBookmarks();

    const newBookMark = {
        id: bookmarks.length> 0 ? bookmarks[bookmarks.length -1].id + 1 : 1,
        uri: uri,
        category: category
    };

    bookmarks.push(newBookMark);

    await writeBookmarks(bookmarks);

    res.status(201).json(newBookMark);
}

async function writeBookmarks(bookmarks) {
    await fs.writeFile(FILE_PATH, JSON.stringify(bookmarks, null, 2));
}

//deleteBookMarkById()
export async function deleteBookMarkById(req, res) {
    const { id } = req.params;
    const bookmarks = await readBookmarks();
    
    const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id == id);

    if(bookmarkIndex !== -1) {
        bookmarks.splice(bookmarkIndex, 1);
        await writeBookmarks(bookmarks);
        res.status(204).send();
    }
    else {
        res.status(404).json({ error: 'Bookmark not found'});
    }
}

//updateBookmarkById()
export async function updateBookMarkById(req, res) {
    const { id } = req.params;
    const { uri, category } = req.body;

    if(!uri || !category) {
        return res.status(400).json({ error: "Bookmark url/ category is required for updation" });
    }

    const bookmarks = await readBookmarks();
    
    const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id == id);
    
    if(bookmarkIndex !== -1) {
        bookmarks[bookmarkIndex] = { ...bookmarks[bookmarkIndex], uri, category: category};

        await writeBookmarks(bookmarks);

        res.status(200);
        res.json(bookmarks[bookmarkIndex]);
    }
    else {
        res.status(404).json({ error: 'Bookmark not found' });
    }
}

//searchBookmark()
export async function searchBookmark(req, res) {
    const { q } = req.query;

    if(!q) {
        return res.status(400).json({ msg: "Query parameter missing" })
    }

    const bookmarks = await readBookmarks();

    const filteredBookmarks = bookmarks.filter(bookmark => 
        bookmark.uri.toLowerCase().includes(q.toLowerCase()) ||
        bookmark.category.toLowerCase().includes(q.toLowerCase())
    );
    res.json(filteredBookmarks);
}
