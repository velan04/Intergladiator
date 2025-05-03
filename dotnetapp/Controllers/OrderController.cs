using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using dotnetapp.Exceptions;

namespace dotnetapp.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly ILogger<OrderController> _logger;

        public OrderController(IOrderService orderService, ILogger<OrderController> logger)
        {
            _orderService = orderService;
            _logger = logger;
        }

        // Get all orders (admin)
        [HttpGet]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
                var orders = await _orderService.GetAllOrdersAsync();
                return Ok(orders);
            }
            catch (OrderException ex)
            {
                _logger.LogWarning($"Order retrieval failed: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving orders: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Get order by ID
        [HttpGet("{id}")]
        [Authorize(Roles = $"{UserRoles.Admin},{UserRoles.User}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            try
            {
                var order = await _orderService.GetOrderByIdAsync(id);
                return Ok(order);
            }
            catch (OrderException ex)
            {
                _logger.LogWarning($"Order not found: {ex.Message}");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving order with ID {id}: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Get orders by User ID
        [HttpGet("user/{userId}")]
        [Authorize(Roles = UserRoles.User)]
        public async Task<IActionResult> GetOrdersByUserId(int userId)
        {
            try
            {
                var orders = await _orderService.GetOrdersByUserIdAsync(userId);
                return Ok(orders);
            }
            catch (OrderException ex)
            {
                _logger.LogWarning($"Order retrieval failed for user {userId}: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving orders for user {userId}: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Create a new order
        [HttpPost]
        [Authorize(Roles = UserRoles.User)]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid data.");
            }

            try
            {
                var success = await _orderService.CreateOrderAsync(order);
                if (!success)
                {
                    throw new OrderException("Failed to create the order.");
                }

                return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
            }
            catch (OrderException ex)
            {
                _logger.LogWarning($"Order creation failed: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating order: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Update an existing order
        [HttpPut("{id}")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] Order order)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid data.");
            }

            try
            {
                order.Id = id;
                bool result = await _orderService.UpdateOrderAsync(order);
                if (!result)
                {
                    throw new OrderException($"Order with ID {id} not found or update failed.");
                }

                return Ok(new { message = "Order updated" });
            }
            catch (OrderException ex)
            {
                _logger.LogWarning($"Order update failed: {ex.Message}");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating order with ID {id}: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Delete an order
        [HttpDelete("{id}")]
        [Authorize(Roles = UserRoles.User)]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            try
            {
                var success = await _orderService.DeleteOrderAsync(id);
                if (!success)
                {
                    throw new OrderException($"Order with ID {id} not found or could not be deleted.");
                }

                return Ok(new { message = "Order deleted" });
            }
            catch (OrderException ex)
            {
                _logger.LogWarning($"Order deletion failed: {ex.Message}");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting order with ID {id}: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
