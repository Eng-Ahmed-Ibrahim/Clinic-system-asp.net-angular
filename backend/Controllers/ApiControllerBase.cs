using backend.Common;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
public abstract class ApiControllerBase : ControllerBase
{
    protected IActionResult HandleResult<T>(Result<T> result)
    {
        if (result.IsSuccess)
        {
            return result.Value is null ? NoContent() : Ok(new {status=200,message=result.Message,data=result.Value});
        }

        return result.ErrorType switch
        {
            ErrorType.NotFound => NotFound(new {status=404, message=result.Message }),
            ErrorType.Conflict => Conflict(new {status=422, message=result.Message }),
            ErrorType.Validation => BadRequest(new { status=422, message=result.Message }),
            _ => BadRequest(new { message=result.Message })
        };
    }
}