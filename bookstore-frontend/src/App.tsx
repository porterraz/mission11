import React, { useEffect, useState } from 'react';

interface Book {
  bookId: number; title: string; author: string; publisher: string;
  isbn: string; classification: string; category: string; pageCount: number; price: number;
}

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [cart, setCart] = useState<Book[]>([]);

  useEffect(() => {
    fetch(`https://localhost:44371/api/book?category=${category}&page=${page}`)
      .then(res => res.json())
      .then(data => { setBooks(data.books); setTotalCount(data.totalCount); });
  }, [category, page]);

  const categories = ["Biography", "Business", "Fiction", "History", "Non-Fiction", "Self-Help"];

  return (
    <div className="container-fluid">
      <nav className="navbar navbar-dark bg-dark p-3 mb-3">
        <span className="navbar-brand">The Bookstore</span>
        <span className="text-white">Items in Cart: {cart.length} | Total: ${cart.reduce((sum, b) => sum + b.price, 0).toFixed(2)}</span>
      </nav>
      <div className="row">
        <div className="col-3">
          <button className={`btn w-100 mb-2 ${category === "" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => {setCategory(""); setPage(1)}}>Home</button>
          {categories.map(c => (
            <button key={c} className={`btn w-100 mb-2 ${category === c ? "btn-primary" : "btn-outline-primary"}`} onClick={() => {setCategory(c); setPage(1)}}>{c}</button>
          ))}
        </div>
        <div className="col-9">
          <table className="table table-striped table-bordered">
            <thead><tr><th>Title</th><th>Author</th><th>Price</th><th>Action</th></tr></thead>
            <tbody>
              {books.map(b => (
                <tr key={b.bookId}>
                  <td>{b.title}</td><td>{b.author}</td><td>${b.price}</td>
                  <td><button className="btn btn-success btn-sm" onClick={() => setCart([...cart, b])}>Add to Cart</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between">
            <button className="btn btn-secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span>Showing {books.length} of {totalCount} books</span>
            <button className="btn btn-secondary" disabled={page * 5 >= totalCount} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;