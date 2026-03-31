using BookstoreAPI.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReact", policy => 
        policy.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod());
});
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));

var app = builder.Build();
app.UseCors("AllowReact"); 
app.MapControllers();
app.Run();