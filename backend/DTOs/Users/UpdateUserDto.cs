using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Users;

public class UpdateUserDto
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