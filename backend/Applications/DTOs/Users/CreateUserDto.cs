using System.ComponentModel.DataAnnotations;

namespace backend.Applications.DTOs.Users;

public class CreateUserDto
{
    [Required]
    [MinLength(6)]
    [MaxLength(30)]
    public string FullName { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [MinLength(6)]
    public string Password { get; set; }

    [Required]
    [Compare(nameof(Password))]
    public string ConfirmPassword { get; set; }
}