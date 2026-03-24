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
        public IActionResult GetBooks(int page = 1, int pageSize = 5)
        {
            // Requirement: Add the ability to allow the user to sort by book title
            var query = _context.Books.OrderBy(b => b.Title);

            // Calculate total count for frontend pagination logic
            var totalCount = query.Count();

            // Requirement: Add pagination listing 5 books per page for as many books as are in the database
            // Requirement: Allow the user to change the number of results per page
            var books = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Returns both the list of books and the total count to help the frontend manage page buttons
            return Ok(new 
            { 
                books, 
                totalCount 
            });
        }
    }
}