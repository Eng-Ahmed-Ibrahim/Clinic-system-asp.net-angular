using backend.DTOs.Users;
using backend.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Applications.Services;
using Microsoft.AspNetCore.Authentication;
using backend.Applications.Interfaces;

namespace backend.Controllers;

[ApiController]
[Route("api/v1/users")]
[Authorize]
public class UsersController(UserManager<AppUser> userManager,IUserService userService) : ApiControllerBase
{

    [HttpGet]
    public async Task<IActionResult> index()
    {
        var users =await userService.ListOfUser();
        return HandleResult(users);
    }   
    [HttpPost]
    [Route("store")]
    public async Task<IActionResult> store([FromBody] CreateUserDto createUserDto)
    {
        var result =await userService.Store(createUserDto);

        return HandleResult(result);
    }
    [HttpPut]
    [Route("update/{id}")]
    public async Task<IActionResult> update([FromBody] UserDto userDto, [FromRoute] int id)
    {
        var result = await userService.Update(userDto,id);
        return HandleResult(result);
    }
    [HttpDelete]
    [Route("delete/{id}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        var result  = await userService.Delete(id);
        return HandleResult(result);
    }
}