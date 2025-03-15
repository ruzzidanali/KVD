namespace MyMvcApp.Models
{
    public class User : AuditEntity
    {
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
