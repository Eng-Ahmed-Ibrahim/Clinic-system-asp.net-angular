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
            return result.Value is null ? NoContent() : Ok(result.Value);
        }

        return result.ErrorType switch
        {
            ErrorType.NotFound => NotFound(new { message = result.Error }),
            ErrorType.Conflict => Conflict(new { message = result.Error }),
            ErrorType.Validation => BadRequest(new { message = result.Error }),
            _ => BadRequest(new { message = result.Error })
        };
    }

    protected IActionResult HandleCreatedResult<T>(Result<T> result, string actionName, object routeValues)
    {
        if (!result.IsSuccess)
        {
            return HandleResult(result);
        }

        return CreatedAtAction(actionName, routeValues, result.Value);
    }
}