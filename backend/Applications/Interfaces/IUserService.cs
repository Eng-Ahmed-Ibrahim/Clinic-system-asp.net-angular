using backend.Common;
using backend.Domain.Entities;
using backend.DTOs.Users;

namespace backend.Applications.Interfaces;
public interface IUserService
{
    public Task<Result<UserDto[]> > ListOfUser();
    public Task<Result<AppUser>> Store(CreateUserDto createUserDto);
    public Task<Result<AppUser>> Update(UserDto userDto,int Id);
    public Task<Result<AppUser>> Delete(int Id);
}