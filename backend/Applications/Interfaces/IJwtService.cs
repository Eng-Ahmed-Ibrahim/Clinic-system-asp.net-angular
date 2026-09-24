namespace backend.Applications.Interfaces;
public interface IJwtService
{
    public string GenerateToken(int userId, string email);
}