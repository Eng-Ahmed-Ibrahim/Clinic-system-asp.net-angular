namespace backend.Services;
public interface IJwtService
{
    public string GenerateToken(int userId, string email);
}