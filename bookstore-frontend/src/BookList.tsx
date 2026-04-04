import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Book {
  bookId: number; title: string; author: string; publisher: string;
  isbn: string; classification: string; category: string; pageCount: number; price: number;
}

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [cart, setCart] = useState<Book[]>([]);
  const pageSize = 5;

  useEffect(() => {
    fetch(`https://porter-bookstore-api.azurewebsites.net/api/book?category=${category}&page=${page}&pageSize=${pageSize}`)
      .then(res => res.json())
      .then(data => { setBooks(data.books); setTotalCount(data.totalCount); });
  }, [category, page]);

  const categories = ["Biography", "Business", "Fiction", "History", "Non-Fiction", "Self-Help"];

  return (
    <div className="container-fluid">
      <nav className="navbar navbar-dark bg-dark p-3 mb-3 d-flex justify-content-between">
        <div>
          <span className="navbar-brand">The Bookstore</span>
          <Link to="/adminbooks" className="btn btn-sm btn-outline-light ms-3">Admin Panel</Link>
        </div>
        <span className="text-white">
          Items: {cart.length} | Total: ${cart.reduce((sum, b) => sum + b.price, 0).toFixed(2)}
        </span>
      </nav>

      <div className="row">
        <div className="col-3">
          <div className="list-group">
            <button className={`list-group-item list-group-item-action ${category === "" ? "active" : ""}`} onClick={() => {setCategory(""); setPage(1);}}>Home</button>
            {categories.map(c => (
              <button key={c} className={`list-group-item list-group-item-action ${category === c ? "active" : ""}`} onClick={() => {setCategory(c); setPage(1);}}>{c}</button>
            ))}
          </div>
        </div>
        <div className="col-9">
          <table className="table table-striped table-bordered table-hover">
            <thead className="thead-dark"><tr><th>Title</th><th>Author</th><th>Category</th><th>Price</th><th>Action</th></tr></thead>
            <tbody>
              {books.map(b => (
                <tr key={b.bookId}>
                  <td>{b.title}</td><td>{b.author}</td><td>{b.category}</td><td>${b.price.toFixed(2)}</td>
                  <td><button className="btn btn-success btn-sm" onClick={() => setCart([...cart, b])}>Add to Cart</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-outline-secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span>Page {page} of {Math.ceil(totalCount / pageSize)}</span>
            <button className="btn btn-outline-secondary" disabled={page * pageSize >= totalCount} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BookList;