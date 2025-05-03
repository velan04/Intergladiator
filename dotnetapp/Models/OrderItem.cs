using System.ComponentModel.DataAnnotations;

namespace dotnetapp.Models
{
    public class OrderItem
    {
        public int Id { get; set; }

        [Required]
        public int BrownieId { get; set; }

        [Required]
        public int Quantity { get; set; }

        public decimal Price { get; set; }

        public Brownie? Brownie { get; set; }

        public int OrderId { get; set; }
        
        public Order? Order { get; set; }

    }
}
