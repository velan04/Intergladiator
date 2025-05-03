using System.ComponentModel.DataAnnotations;

namespace dotnetapp.Models
{
    public class User
    {
        public int UserId { get; set; }
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
        
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; }
        
        [Required(ErrorMessage = "MobileNumber is required")]
        public string MobileNumber { get; set; }

        [Required(ErrorMessage = "UserRole is required")]
        public string UserRole { get; set; }

        public string? SecretKey { get; set; } // Add this line
    }
}
