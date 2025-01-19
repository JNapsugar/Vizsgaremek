using System.ComponentModel.DataAnnotations;

namespace IngatlanokBackend.DTOs
{
    public class LoginDTO
    {
        [Required]
        public string loginName { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
