using Microsoft.AspNetCore.Identity;

namespace backend.Models;
public class AppUser : IdentityUser<int>
{
    public string fullName {get;set;}

    
}