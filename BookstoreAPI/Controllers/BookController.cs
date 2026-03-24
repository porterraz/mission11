using Microsoft.AspNetCore.Mvc;
using BookstoreAPI.Models;

[Route("api/[controller]")]
[ApiController]
public class BookController : ControllerBase
{
    private BookstoreContext _context;
    public BookController(BookstoreContext temp) => _context = temp;

    [HttpGet]
    public IActionResult GetBooks(int page = 1, int pageSize = 5)
    {
        var query = _context.Books.OrderBy(b => b.Title); // Requirement: Sort by Title [cite: 26]

        var totalCount = query.Count();
        var books = query
            [cite_start].Skip((page - 1) * pageSize) // Requirement: Pagination [cite: 23]
            .Take(pageSize)
            .ToList();

        return Ok(new { books, totalCount });
    }
}