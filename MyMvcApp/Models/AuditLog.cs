public class AuditLog
{
    public int Id { get; set; }
    public string Action { get; set; } 
    public string TableName { get; set; }
    public string UserName { get; set; } 
    public string? OldData { get; set; } 
    public string? NewData { get; set; } 
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
