using dotnetapp.Models;

namespace dotnetapp.Services
{
    public interface IBrownieService
    {
        Task<IEnumerable<Brownie>> GetAllBrowniesAsync();
        Task<Brownie> GetBrownieByIdAsync(int id);
        Task<bool> CreateBrownieAsync(Brownie brownie);
        Task<bool> UpdateBrownieAsync(Brownie brownie);
        Task<bool> DeleteBrownieAsync(int id);
    }
}
