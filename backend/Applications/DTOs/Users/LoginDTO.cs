using System.ComponentModel.DataAnnotations;

namespace backend.Applications.DTOs.Users;

public class LoginDTO
{
    [Required]
    [EmailAddress]
    public string Email {get;set;}
    [Required]
    public string Password {get;set;}
}