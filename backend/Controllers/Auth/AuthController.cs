using backend.Applications.DTOs.Users;
using backend.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using backend.Applications.Interfaces;

namespace backend.Controllers.Auth;

[ApiController]
[Route("api/v1/auth")]
public class AuthController(
    UserManager<AppUser> userManager,
    IJwtService jwtService
) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] CreateUserDto requestData)
    {
        var existsUser = await userManager.FindByEmailAsync(requestData.Email);
        if (existsUser != null)
        {
            return BadRequest(new { message = "Email already exists" });
        }

        var user = new AppUser
        {
            UserName = requestData.Email,
            Email = requestData.Email
        };

        var result = await userManager.CreateAsync(user, requestData.Password);
        if (!result.Succeeded)
        {
            return BadRequest(new
            {
                errors = result.Errors.Select(e => e.Description)
            });
        }

        return Ok(new { message = "User registered successfully" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
    {
        var user = await userManager.FindByEmailAsync(loginDTO.Email);

        if (user == null || !await userManager.CheckPasswordAsync(user, loginDTO.Password))
        {
            return Unauthorized(new { message = "Email or Password invalid" }); // 401 Unauthorized أصح منطقياً لخطأ الـ Auth
        }

        var token = jwtService.GenerateToken(user.Id, user.Email!);

        return Ok(new
        {
            username = user.UserName,
            email = user.Email,
            token = token
        });
    }

    [HttpGet("profile")]
[Authorize]
public IActionResult Profile()
{
    return Ok("Authenticated!");
}
}