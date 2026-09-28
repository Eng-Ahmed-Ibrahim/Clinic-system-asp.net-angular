using backend.Applications.Interfaces;
using backend.Common;
using backend.Domain.Entities;
using backend.Applications.DTOs.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Applications.Services;

public class UserService(UserManager<AppUser> userManager) : IUserService
{
    public async Task<Result<AppUser>> Delete(int id)
    {
        var user = await userManager.FindByIdAsync(id.ToString());
        if (user == null)
            return Result<AppUser>.NotFound("المستخدم غير موجود");
        await userManager.DeleteAsync(user);
        return Result<AppUser>.Success(user);

    }

    public async Task<Result<UserDto[]>> ListOfUser()
    {

        var users =await userManager.Users
            .OrderByDescending(u => u.Id)
            .Select(u=>new UserDto
            {
                Id=u.Id,
                FullName=u.fullName,
                Email=u.Email,
                UserName=u.UserName
            })
            .ToArrayAsync();

        return Result<UserDto[]>.Success(users);
    }

    public async Task<Result<AppUser>> Store(CreateUserDto createUserDto)
    {
        var checkIfUserExists = userManager.FindByEmailAsync(createUserDto.Email);
        if (checkIfUserExists != null)
        {
            return Result<AppUser>.Conflict("المستخدم موجود بالفعل");
        }
        var user = new AppUser
        {
            fullName = createUserDto.FullName,
            Email = createUserDto.Email,
            UserName = createUserDto.FullName
        };
        await userManager.CreateAsync(user, createUserDto.Password);
        return Result<AppUser>.Success(user);
    }

    public async Task<Result<AppUser>> Update(UserDto userDto, int Id)
    {
        var user = await userManager.FindByIdAsync(Id.ToString());
        if (user == null)
        {
            return Result<AppUser>.NotFound("المستخدم غير موجود");
        }
        if (userDto.Email != null)
            user.Email = userDto.Email;
        if (userDto.FullName != null)
            user.Email = userDto.FullName;
        await userManager.UpdateAsync(user);
        return Result<AppUser>.Success(user);

    }


}