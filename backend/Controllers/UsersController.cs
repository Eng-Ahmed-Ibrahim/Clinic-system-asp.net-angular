using backend.DTOs.Users;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/v1/users")]
[Authorize]
public class UsersController(UserManager<AppUser> userManager) : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult> index()
    {
        var users = await userManager.Users.OrderByDescending(u => u.Id)
            .Select(u => new UserDto
            {
                Id = u.Id,
                FullName = u.fullName,
                Email = u.Email,
                UserName = u.UserName
            })
                .ToListAsync();

        return Ok(users);
    }
    [HttpPost]
    [Route("store")]
    public async Task<ActionResult> store([FromBody] CreateUserDto createUserDto)
    {
        var checkIfEmailExists = await userManager.FindByEmailAsync(createUserDto.Email);
        if (checkIfEmailExists != null)
        {
            return BadRequest(new
            {
                message = "المستخدم موجود بالفعل "
            });
        }
        var user = new AppUser
        {
            UserName = createUserDto.Email,
            Email = createUserDto.Email,
            fullName = createUserDto.FullName,
        };
        var result = await userManager.CreateAsync(user, createUserDto.Password);
        if (!result.Succeeded)
        {
            return BadRequest(new
            {
                errors = result.Errors.Select(e => e.Description)
            });
        }
        return Ok(new { message = "User Created Successfully" });
    }
    [HttpPut]
    [Route("update/{id}")]
    public async Task<ActionResult> update([FromBody] UserDto userDto, [FromRoute] string id)
    {
        var user = await userManager.FindByIdAsync(id);
        if (user == null)
        {
            return BadRequest(new
            {
                message = "User Not Found"
            });
        }
        if (userDto.FullName != null)
            user.fullName = userDto.FullName;

        if (userDto.UserName != null)
            user.UserName = userDto.UserName;

        if (userDto.Email != null)
            user.Email = userDto.Email;

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest(result.Errors);
        return Ok(new
        {
            message = "User updated successfully"
        });
    }
    [HttpDelete]
    [Route("delete/{id}")]
    public async Task<ActionResult> Delete([FromRoute] string id)
    {
        var user = await userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        await userManager.DeleteAsync(user);
        return Ok(new
        {
            message = "User deleted successfully"
        });
    }
}