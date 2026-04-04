import React, { useEffect, useState } from 'react';

interface Book {
  bookId: number; title: string; author: string; publisher: string;
  isbn: string; classification: string; category: string; pageCount: number; price: number;
}

function Admin() {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState<Book>({
    bookId: 0, title: "", author: "", publisher: "", isbn: "", 
    classification: "", category: "", pageCount: 0, price: 0
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchBooks = () => {
    // Fetching 100 books just for the admin table view
    fetch(`http://localhost:5231/api/book?page=1&pageSize=100`)
      .then(res => res.json())
      .then(data => setBooks(data.books));
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing ? `http://localhost:5231/api/book/${form.bookId}` : `http://localhost:5231/api/book`;
    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    }).then(() => {
      fetchBooks();
      setForm({ bookId: 0, title: "", author: "", publisher: "", isbn: "", classification: "", category: "", pageCount: 0, price: 0 });
      setIsEditing(false);
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      fetch(`http://localhost:5231/api/book/${id}`, { method: "DELETE" })
        .then(() => fetchBooks());
    }
  };

  const handleEdit = (b: Book) => {
    setForm(b);
    setIsEditing(true);
    window.scrollTo(0, 0); // Scroll to form
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Admin Panel - Manage Books</h2>
        <a href="/" className="btn btn-secondary">Back to Store</a>
      </div>

      {/* CRUD Form */}
      <div className="card p-4 mb-4">
        <h4>{isEditing ? "Edit Book" : "Add New Book"}</h4>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6"><label>Title</label><input required className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
          <div className="col-md-6"><label>Author</label><input required className="form-control" value={form.author} onChange={e => setForm({...form, author: e.target.value})} /></div>
          <div className="col-md-4"><label>Category</label><input required className="form-control" value={form.category} onChange={e => setForm({...form, category: e.target.value})} /></div>
          <div className="col-md-4"><label>Publisher</label><input required className="form-control" value={form.publisher} onChange={e => setForm({...form, publisher: e.target.value})} /></div>
          <div className="col-md-4"><label>Price ($)</label><input required type="number" step="0.01" className="form-control" value={form.price} onChange={e => setForm({...form, price: parseFloat(e.target.value)})} /></div>
          <div className="col-md-4"><label>ISBN</label><input required className="form-control" value={form.isbn} onChange={e => setForm({...form, isbn: e.target.value})} /></div>
          <div className="col-md-4"><label>Classification</label><input required className="form-control" value={form.classification} onChange={e => setForm({...form, classification: e.target.value})} /></div>
          <div className="col-md-4"><label>Page Count</label><input required type="number" className="form-control" value={form.pageCount} onChange={e => setForm({...form, pageCount: parseInt(e.target.value)})} /></div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary me-2">{isEditing ? "Update Book" : "Add Book"}</button>
            {isEditing && <button type="button" className="btn btn-warning" onClick={() => { setIsEditing(false); setForm({ bookId: 0, title: "", author: "", publisher: "", isbn: "", classification: "", category: "", pageCount: 0, price: 0 }); }}>Cancel</button>}
          </div>
        </form>
      </div>

      {/* Book List for Admin */}
      <table className="table table-bordered">
        <thead className="table-dark"><tr><th>ID</th><th>Title</th><th>Author</th><th>Price</th><th>Actions</th></tr></thead>
        <tbody>
          {books.map(b => (
            <tr key={b.bookId}>
              <td>{b.bookId}</td><td>{b.title}</td><td>{b.author}</td><td>${b.price.toFixed(2)}</td>
              <td>
                <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(b)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b.bookId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Admin;