namespace IngatlanokBackend.DTOs
{
    public class UpdateUserDTO
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public int? PermissionId { get; set; } 
        public string LoginNev { get; set; }
        public string? Password { get; set; }
        public string ProfilePicturePath { get; set; } 
    }
}
