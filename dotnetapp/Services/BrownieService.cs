using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.EntityFrameworkCore;

namespace dotnetapp.Services
{
    public class BrownieService : IBrownieService
    {
        private readonly ApplicationDbContext _context;

        public BrownieService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Brownie>> GetAllBrowniesAsync()
        {
            return await _context.Brownies.ToListAsync();
        }

        public async Task<Brownie> GetBrownieByIdAsync(int id)
        {
            return await _context.Brownies.FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<bool> CreateBrownieAsync(Brownie brownie)
        {
            _context.Brownies.Add(brownie);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateBrownieAsync(Brownie brownie)
        {
            var existing = await _context.Brownies.FindAsync(brownie.Id);
            if (existing == null) return false;

            _context.Entry(existing).CurrentValues.SetValues(brownie);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteBrownieAsync(int id)
        {
            var brownie = await _context.Brownies.FindAsync(id);
            if (brownie == null) return false;

            _context.Brownies.Remove(brownie);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
