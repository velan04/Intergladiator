using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Exceptions;

namespace dotnetapp.Services
{
    public class OrderService : IOrderService
    {
        private readonly ApplicationDbContext _context;

        public OrderService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Order>> GetAllOrdersAsync()
        {
            return await _context.Orders
                                .Include(o => o.User) // 👈 Include user
                                .Include(o => o.OrderItems)
                                .ThenInclude(oi => oi.Brownie)
                                .ToListAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id)
        {
            return await _context.Orders
                                .Include(o => o.User) // 👈 Include user
                                .Include(o => o.OrderItems)
                                .ThenInclude(oi => oi.Brownie)
                                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(int userId)
        {
            return await _context.Orders
                                .Where(o => o.UserId == userId)
                                .Include(o => o.User) // 👈 Include user
                                .Include(o => o.OrderItems)
                                .ThenInclude(oi => oi.Brownie)
                                .ToListAsync();
        }

        public async Task<bool> CreateOrderAsync(Order order)
        {
            // Validate order items
            foreach (var item in order.OrderItems)
            {
                var brownie = await _context.Brownies.FindAsync(item.BrownieId);
                if (brownie == null)
                    throw new OrderException($"Brownie with ID {item.BrownieId} not found.");

                if (brownie.StockCount < item.Quantity)
                    throw new OrderException($"Insufficient stock for brownie: {brownie.Name}");

                brownie.StockCount -= item.Quantity; // Deduct the quantity
            }

            // Add the order to the database
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> UpdateOrderAsync(Order order)
        {
            var existing = await _context.Orders.Include(o => o.OrderItems)
                                                .FirstOrDefaultAsync(o => o.Id == order.Id);
            if (existing == null) return false;

            existing.Status = order.Status;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteOrderAsync(int id)
        {
            try
            {
                var order = await _context.Orders.Include(o => o.OrderItems)
                                                .FirstOrDefaultAsync(o => o.Id == id);
                if (order == null) return false;

                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                // Log the error (optional)
                return false;
            }
        }
    }
}
