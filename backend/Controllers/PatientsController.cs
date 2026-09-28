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
}