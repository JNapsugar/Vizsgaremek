namespace IngatlanokBackend.DTOs
{
    public class RegistrationDTO
    {
        public string LoginName { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public int PermissionId { get; set; }
        public string? ProfilePicturePath { get; set; } = null;
    }
}
