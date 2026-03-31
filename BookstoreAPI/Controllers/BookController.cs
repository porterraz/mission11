using Microsoft.AspNetCore.Mvc;
using BookstoreAPI.Models;

namespace BookstoreAPI.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase {
        private BookstoreContext _context;
        public BookController(BookstoreContext temp) => _context = temp;

        [HttpGet]
        public IActionResult GetBooks(string? category, int page = 1, int pageSize = 5) {
            var query = _context.Books.AsQueryable();

            if (!string.IsNullOrEmpty(category)) {
                query = query.Where(b => b.Category == category);
            }

            var totalCount = query.Count();
            var books = query.OrderBy(b => b.Title)
                             .Skip((page - 1) * pageSize)
                             .Take(pageSize).ToList();

            return Ok(new { books, totalCount });
        }
    }
}