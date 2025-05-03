using System;
using System.ComponentModel.DataAnnotations;

namespace dotnetapp.Models
{
    public class Brownie
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        public string ImageUrl { get; set; }

        public int  StockCount { get; set; }  = 0;
    }
}
