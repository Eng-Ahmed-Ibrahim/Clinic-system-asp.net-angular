using backend.Applications.Interfaces;
using backend.Applications.DTOs.Doctors;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("api/v1/[controller]")]
public class DoctorsController(IDoctorService doctorService) : ApiControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetDoctors()
    {
        var result = await doctorService.GetDoctors();

        return HandleResult(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateDoctor([FromBody] CreateDoctorDto dto)
    {
        var result = await doctorService.CreateDoctor(dto);

        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return HandleResult(result);

    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDoctor([FromRoute] long id)
    {
        var result = await doctorService.DeleteDoctor(id);

        if (!result.IsSuccess)
            return NotFound(result.Error);

        return HandleResult(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDoctor(
        [FromRoute]  long id,
        [FromBody]  UpdateDoctorDto dto)
    {
        var result = await doctorService.UpdateDoctor(dto, id);

        if (!result.IsSuccess)
            return NotFound(result.Error);

        return HandleResult(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetDoctorById([FromRoute] long id)
    {
        var result = await doctorService.GetDoctorById(id);
        return HandleResult(result);
    }
}