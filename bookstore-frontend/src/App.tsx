import React, { useEffect, useState } from 'react';

// Define the book structure based on your C# Model
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Default: 5 books per page
  const [totalCount, setTotalCount] = useState(0);
  const [sortDir, setSortDir] = useState("asc"); // State to track sorting direction

  useEffect(() => {
    // Calling the HTTPS port (7149) directly to avoid CORS redirect issues
    fetch(`https://localhost:7149/api/book?page=${page}&pageSize=${pageSize}&sort=${sortDir}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setBooks(data.books);
        setTotalCount(data.totalCount);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [page, pageSize, sortDir]); // Re-run fetch when page, size, or sort changes

  return (
    <div className="container mt-4">
      <header className="text-center bg-dark text-white p-4 mb-4 rounded shadow">
        <h1>Hilton's Academic Bookstore</h1>
        <p>A collection of required readings and library favorites.</p>
      </header>

      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Requirement: Allow user to change results per page */}
        <div className="input-group w-auto">
          <label className="input-group-text">Items per page:</label>
          <select 
            className="form-select" 
            value={pageSize} 
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
        <div className="text-muted fw-bold">Total Books: {totalCount}</div>
      </div>

      <table className="table table-striped table-bordered table-hover shadow-sm">
        <thead className="table-secondary">
          <tr>
            {/* Requirement: Allow the user to sort by book title */}
            <th 
              style={{ cursor: "pointer", userSelect: "none" }} 
              onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
              title="Click to sort by Title"
            >
              Title {sortDir === "asc" ? "▲" : "▼"}
            </th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Pages</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.bookId}>
              <td className="fw-bold">{b.title}</td>
              <td>{b.author}</td>
              <td>{b.publisher}</td>
              <td>{b.isbn}</td>
              <td>{b.category}</td>
              <td>{b.pageCount}</td>
              <td>${b.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Requirement: Add pagination */}
      <nav className="d-flex justify-content-center mt-4">
        <ul className="pagination">
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPage(page - 1)}>Previous</button>
          </li>
          <li className="page-item disabled">
            <span className="page-link text-dark">Page {page}</span>
          </li>
          <li className={`page-item ${page * pageSize >= totalCount ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default App;