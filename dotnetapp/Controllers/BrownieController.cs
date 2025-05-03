using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace dotnetapp.Controllers
{
    [Route("api/brownie")]
    [ApiController]
    public class BrownieController : ControllerBase
    {
        private readonly IBrownieService _brownieService;
        private readonly ILogger<BrownieController> _logger;

        public BrownieController(IBrownieService brownieService, ILogger<BrownieController> logger)
        {
            _brownieService = brownieService;
            _logger = logger;
        }

        // Get all brownies
        [HttpGet]
        public async Task<IActionResult> GetAllBrownies()
        {
            try
            {
                var brownies = await _brownieService.GetAllBrowniesAsync();
                return Ok(brownies);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving brownies: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Get brownie by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBrownieById(int id)
        {
            try
            {
                var brownie = await _brownieService.GetBrownieByIdAsync(id);
                if (brownie == null)
                {
                    return NotFound(new { message = "Brownie not found." });
                }
                return Ok(brownie);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving brownie with ID {id}: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Add a new brownie (Admin only)
        [HttpPost]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> AddBrownie([FromBody] Brownie brownie)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid data.");
            }

            try
            {
                await _brownieService.CreateBrownieAsync(brownie);
                return CreatedAtAction(nameof(GetBrownieById), new { id = brownie.Id }, brownie);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error adding brownie: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Update an existing brownie (Admin only)
        [HttpPut("{id}")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> UpdateBrownie(int id, [FromBody] Brownie brownie)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid data.");
            }

            try
            {
                brownie.Id = id;
                var updated = await _brownieService.UpdateBrownieAsync(brownie);
                if (!updated)
                {
                    return NotFound(new { message = "Brownie not found." });
                }
                return Ok(new { message = "Brownie updated successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating brownie with ID {id}: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Delete a brownie (Admin only)
        [HttpDelete("{id}")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> DeleteBrownie(int id)
        {
            try
            {
                var deleted = await _brownieService.DeleteBrownieAsync(id);
                if (!deleted)
                {
                    return NotFound(new { message = "Brownie not found." });
                }
                return Ok(new { message = "Brownie deleted successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting brownie with ID {id}: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
