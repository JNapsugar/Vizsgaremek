namespace IngatlanokBackend.DTOs
{
    public class GetCurrentUserDTO
    {
        public int Id { get; set; }
        public string LoginNev { get; set; }
        public string Name { get; set; }
        public int? PermissionId { get; set; }
        public bool Active { get; set; }
        public string Email { get; set; }
        public string ProfilePicturePath { get; set; }

    }
}
