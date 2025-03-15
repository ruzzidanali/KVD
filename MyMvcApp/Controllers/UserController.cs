using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyMvcApp.Models;
using Newtonsoft.Json;
using Serilog;
using System.Linq;
using System.Threading.Tasks;

namespace MyMvcApp.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            return View(await _context.Users.ToListAsync());
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(User user)
        {
            if (ModelState.IsValid)
            {
                _context.Add(user);
                await _context.SaveChangesAsync();

                var auditLog = new AuditLog
                {
                    Action = "Create",
                    TableName = "Users",
                    UserName = User.Identity?.Name ?? "System",
                    NewData = JsonConvert.SerializeObject(user)
                };
                
                Log.Information("User {Name} created successfully", user.Name);
                
                return RedirectToAction(nameof(Index));
            }
            return View(user);
        }

        public async Task<IActionResult> Edit(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            return View(user);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(int id, User user)
        {
            if (id != user.Id) return NotFound();

            if (ModelState.IsValid)
            {
                _context.Update(user);
                await _context.SaveChangesAsync();
                Log.Information("User {Name} updated successfully", user.Name);
                return RedirectToAction(nameof(Index));
            }
            return View(user);
        }

        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) 
            {
                return NotFound();
            }

            user.IsDeleted = true;
            await _context.SaveChangesAsync();

            var auditLog = new AuditLog
            {
                Action = "Delete",
                TableName = "Users",
                UserName = User.Identity?.Name ?? "System",
                OldData = JsonConvert.SerializeObject(user),
                NewData = ""
            };
            _context.AuditLogs.Add(auditLog);
            await _context.SaveChangesAsync();

            Log.Information("User {Name} deleted (soft delete)", user.Name);
            
            return RedirectToAction(nameof(Index));
        }
    }
}
