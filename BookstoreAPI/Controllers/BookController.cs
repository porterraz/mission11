using Microsoft.AspNetCore.Mvc;
using BookstoreAPI.Models;
using System.Linq;

namespace BookstoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookstoreContext _context;

        public BookController(BookstoreContext temp)
        {
            _context = temp;
        }

        [HttpGet]
        public IActionResult GetBooks(int page = 1, int pageSize = 5, string sort = "asc")
        {
            // Toggle between ascending and descending based on user input
            var query = sort == "desc" 
                ? _context.Books.OrderByDescending(b => b.Title) 
                : _context.Books.OrderBy(b => b.Title);

            // Calculate total count for frontend pagination logic
            var totalCount = query.Count();

            // Pagination listing X books per page
            var books = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Returns both the list of books and the total count
            return Ok(new 
            { 
                books, 
                totalCount 
            });
        }
    }
}