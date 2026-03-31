import React, { useEffect, useState } from 'react';

interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [cart, setCart] = useState<Book[]>([]);
  const pageSize = 5;

  useEffect(() => {
    // FIXED: Used backticks (`) and added &category parameter for Mission 12
    fetch(`http://localhost:5231/api/book?category=${category}&page=${page}&pageSize=${pageSize}`)      .then(res => res.json())
      .then(data => {
        setBooks(data.books);
        setTotalCount(data.totalCount);
      })
      .catch(err => console.error("Fetch error:", err));
  }, [category, page]);

  const categories = ["Biography", "Business", "Fiction", "History", "Non-Fiction", "Self-Help"];

  return (
    <div className="container-fluid">
      {/* Navbar with Cart Summary - Mission 12 Requirement */}
      <nav className="navbar navbar-dark bg-dark p-3 mb-3">
        <span className="navbar-brand">The Bookstore</span>
        <span className="text-white">
          Items: {cart.length} | Total: ${cart.reduce((sum, b) => sum + b.price, 0).toFixed(2)}
        </span>
      </nav>

      <div className="row">
        {/* Category Sidebar - Mission 12 Requirement */}
        <div className="col-3">
          <div className="list-group">
            <button 
              className={`list-group-item list-group-item-action ${category === "" ? "active" : ""}`}
              onClick={() => {setCategory(""); setPage(1);}}
            >
              Home
            </button>
            {categories.map(c => (
              <button 
                key={c}
                className={`list-group-item list-group-item-action ${category === c ? "active" : ""}`}
                onClick={() => {setCategory(c); setPage(1);}}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Book Table - Bootstrap Grid Layout */}
        <div className="col-9">
          <table className="table table-striped table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {books.map(b => (
                <tr key={b.bookId}>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.category}</td>
                  <td>${b.price.toFixed(2)}</td>
                  <td>
                    <button 
                      className="btn btn-success btn-sm" 
                      onClick={() => setCart([...cart, b])}
                    >
                      Add to Cart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination logic - Adjusts based on category */}
          <div className="d-flex justify-content-between mt-3">
            <button 
              className="btn btn-outline-secondary" 
              disabled={page === 1} 
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span>Page {page} of {Math.ceil(totalCount / pageSize)}</span>
            <button 
              className="btn btn-outline-secondary" 
              disabled={page * pageSize >= totalCount} 
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;