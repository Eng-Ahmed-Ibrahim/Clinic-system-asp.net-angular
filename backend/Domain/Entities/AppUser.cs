using Microsoft.AspNetCore.Identity;

namespace backend.Domain.Entities;
public class AppUser : IdentityUser<int>
{
    public string fullName {get;set;}

    
}