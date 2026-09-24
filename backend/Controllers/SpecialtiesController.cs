using backend.DTOs.Specialties;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("api/v1/specialties")]
public class SpecialtiesController(ISpecialtyService specialtyService) : ApiControllerBase
{
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
        var result = await specialtyService.GetByIdAsync(id);
        return HandleResult(result);
    }

    [HttpPost]
    [Route("store")]
    public async Task<IActionResult> Store([FromBody] SpecialtyDto specialtyDto)
    {
        var result = await specialtyService.CreateAsync(specialtyDto);
        return HandleCreatedResult(result, nameof(GetById), new { id = result.Value?.Id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] SpecialtyDto specialtyDto)
    {
        var result = await specialtyService.UpdateAsync(id, specialtyDto);
        return HandleResult(result);
    }
}