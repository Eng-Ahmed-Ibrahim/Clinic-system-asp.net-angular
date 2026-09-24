using backend.DTOs.Specialties;
using backend.Applications.Services;
using Microsoft.AspNetCore.Mvc;
using backend.Applications.Interfaces;
using backend.Common;

namespace backend.Controllers;

[Route("api/v1/specialties")]
public class SpecialtiesController(ISpecialtyService specialtyService) : ApiControllerBase
{
    [HttpGet]
    public async Task<IActionResult> List()
    {
        var specialties = await specialtyService.List();
        return HandleResult(specialties);
    }
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
        return HandleCreatedResult(result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] SpecialtyDto specialtyDto)
    {
        var result = await specialtyService.UpdateAsync(id, specialtyDto);
        return HandleResult(result);
    }
}