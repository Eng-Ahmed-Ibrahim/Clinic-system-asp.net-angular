using backend.Applications.Interfaces;
using backend.Common;
using backend.Domain.Entities;
using backend.Applications.DTOs.Patients;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;
[ApiController]
[Route("api/v1/[controller]")]
public class PatientsController(IPatientService patientService) : ApiControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreatePatient([FromBody] CreatePatientDto createPatient)
    {
        var result =await patientService.CreatePatient(createPatient);
        return HandleResult(result);
    }
    [HttpGet]
    public async Task<IActionResult> GetPatients()
    {
        var result = await patientService.GetPatients();
        return HandleResult(result);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePatient([FromRoute] long id)
    {
        var result = await patientService.DeletePatient(id);
        return HandleResult(result);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePatient([FromRoute] long id , [FromBody]CreatePatientDto  data)
    {
        var result = await patientService.UpdatePatient(id,data);
        return HandleResult(result);
    }
}