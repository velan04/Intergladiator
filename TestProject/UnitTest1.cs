using dotnetapp.Exceptions;
using dotnetapp.Models;
using dotnetapp.Data;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System.Linq;
using System.Reflection;
using dotnetapp.Services;
using System;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http;
using System.Text;

namespace dotnetapp.Tests
{
    [TestFixture]
    public class Tests
    {

        private ApplicationDbContext _context; 
        private HttpClient _httpClient;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase(databaseName: "TestDatabase").Options;
            _context = new ApplicationDbContext(options);
           
             _httpClient = new HttpClient();
             _httpClient.BaseAddress = new Uri("http://localhost:8080");

        }

        [TearDown]
        public void TearDown()
        {
             _context.Dispose();
        }

    [Test, Order(1)]
    public async Task Backend_Test_Post_Method_Register_Admin_Returns_HttpStatusCode_OK()
    {
        // Arrange
        ClearDatabase(); // Ensure this clears both Identity and custom user tables if needed

        string uniqueId = Guid.NewGuid().ToString();
        string uniqueUsername = $"user_{uniqueId}";
        string uniqueEmail = $"user_{uniqueId}@example.com";

        var userPayload = new
        {
            Username = uniqueUsername,
            Password = "Test@123A",
            Email = uniqueEmail,
            MobileNumber = "9876543210",
            UserRole = "Admin"
        };

        var jsonPayload = JsonConvert.SerializeObject(userPayload);
        var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

        // Act
        var response = await _httpClient.PostAsync("/api/auth/register", content);
        var responseString = await response.Content.ReadAsStringAsync();

        Console.WriteLine($"Status Code: {response.StatusCode}");
        Console.WriteLine($"Response Body: {responseString}");

        // Assert
        Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
        StringAssert.Contains("User created successfully", responseString);
    }

    [Test, Order(2)]
    public async Task Backend_Test_Post_Method_Login_Admin_Returns_HttpStatusCode_OK()
    {
        ClearDatabase();

        string uniqueId = Guid.NewGuid().ToString();
        string uniqueUsername = $"abcd_{uniqueId}";
        string uniqueEmail = $"abcd{uniqueId}@gmail.com";

        // Register the user first
        string registerRequestBody = $"{{\"Username\": \"{uniqueUsername}\", \"Password\": \"abc@123A\", \"Email\": \"{uniqueEmail}\", \"MobileNumber\": \"1234567890\", \"UserRole\": \"Admin\"}}";
        HttpResponseMessage registerResponse = await _httpClient.PostAsync("/api/auth/register", new StringContent(registerRequestBody, Encoding.UTF8, "application/json"));

        string registerResponseBody = await registerResponse.Content.ReadAsStringAsync();
        Console.WriteLine("Registration Response: " + registerResponseBody);

        // Login using the same credentials
        string loginRequestBody = $"{{\"Email\" : \"{uniqueEmail}\",\"Password\" : \"abc@123A\"}}";
        HttpResponseMessage loginResponse = await _httpClient.PostAsync("/api/auth/login", new StringContent(loginRequestBody, Encoding.UTF8, "application/json"));

        string loginResponseBody = await loginResponse.Content.ReadAsStringAsync();
        Console.WriteLine("Login Response: " + loginResponseBody);

        // Assert the login was successful
        Assert.AreEqual(HttpStatusCode.OK, loginResponse.StatusCode);
        StringAssert.Contains("token", loginResponseBody.ToLower());
    }

    [Test, Order(3)]
    public async Task Backend_Test_Post_Brownie_With_Token_By_Admin_Returns_HttpStatusCode_Created()
    {
        // Arrange
        ClearDatabase();
        string uniqueId = Guid.NewGuid().ToString();
        string uniqueUsername = $"admin_{uniqueId}";
        string uniqueEmail = $"admin_{uniqueId}@example.com";

        var registerPayload = new
        {
            Username = uniqueUsername,
            Password = "Admin@123",
            Email = uniqueEmail,
            MobileNumber = "9999999999",
            UserRole = "Admin"
        };

        var registerContent = new StringContent(JsonConvert.SerializeObject(registerPayload), Encoding.UTF8, "application/json");
        HttpResponseMessage registerResponse = await _httpClient.PostAsync("/api/auth/register", registerContent);
        string registerResponseBody = await registerResponse.Content.ReadAsStringAsync();
        Console.WriteLine("Registration Response: " + registerResponseBody);
        Assert.AreEqual(HttpStatusCode.OK, registerResponse.StatusCode);

        // Login
        var loginPayload = new
        {
            Email = uniqueEmail,
            Password = "Admin@123"
        };

        var loginContent = new StringContent(JsonConvert.SerializeObject(loginPayload), Encoding.UTF8, "application/json");
        HttpResponseMessage loginResponse = await _httpClient.PostAsync("/api/auth/login", loginContent);
        string loginResponseBody = await loginResponse.Content.ReadAsStringAsync();
        Console.WriteLine("Login Response: " + loginResponseBody);
        Assert.AreEqual(HttpStatusCode.OK, loginResponse.StatusCode);

        dynamic loginResult = JsonConvert.DeserializeObject(loginResponseBody);
        string token = loginResult.token;
        Assert.IsNotNull(token);
        Console.WriteLine("Token: " + token);

        // Brownie creation
        var browniePayload = new
        {
            Name = $"Choco Fudge {uniqueId}",
            Description = "Rich chocolate brownie with fudge center",
            Price = 4.99,
            ImageUrl = "https://example.com/images/choco-fudge.jpg",
            StockCount = 20
        };

        var brownieContent = new StringContent(JsonConvert.SerializeObject(browniePayload), Encoding.UTF8, "application/json");
        _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        // Act
        HttpResponseMessage brownieResponse = await _httpClient.PostAsync("/api/brownie", brownieContent);
        string brownieResponseBody = await brownieResponse.Content.ReadAsStringAsync();
        Console.WriteLine("Brownie Response: " + brownieResponseBody);

        // Assert
        Assert.AreEqual(HttpStatusCode.Created, brownieResponse.StatusCode);
    }

    [Test, Order(4)]
    public async Task Backend_Test_Post_Brownie_Without_Token_By_Admin_Returns_Unauthorized()
    {
        // Arrange
        ClearDatabase();

        // Register Admin
        string uniqueId = Guid.NewGuid().ToString();
        string uniqueEmail = $"admin_{uniqueId}@example.com";

        var registerPayload = new { Username = $"admin_{uniqueId}", Password = "Admin@123", Email = uniqueEmail, MobileNumber = "9999999999", UserRole = "Admin" };
        var registerContent = new StringContent(JsonConvert.SerializeObject(registerPayload), Encoding.UTF8, "application/json");

        HttpResponseMessage registerResponse = await _httpClient.PostAsync("/api/auth/register", registerContent);
        Assert.AreEqual(HttpStatusCode.OK, registerResponse.StatusCode);

        // Login (but do NOT use token)
        var loginPayload = new { Email = uniqueEmail, Password = "Admin@123" };
        var loginContent = new StringContent(JsonConvert.SerializeObject(loginPayload), Encoding.UTF8, "application/json");
        HttpResponseMessage loginResponse = await _httpClient.PostAsync("/api/auth/login", loginContent);
        Assert.AreEqual(HttpStatusCode.OK, loginResponse.StatusCode);

        // Try posting brownie WITHOUT setting Authorization header
        var browniePayload = new
        {
            Name = $"Unauthorized Brownie {uniqueId}",
            Description = "Should be unauthorized",
            Price = 5.99,
            ImageUrl = "",
            StockCount = 10
        };

        var brownieContent = new StringContent(JsonConvert.SerializeObject(browniePayload), Encoding.UTF8, "application/json");

        // Act
        HttpResponseMessage brownieResponse = await _httpClient.PostAsync("/api/brownie", brownieContent);

        // Assert
        Assert.AreEqual(HttpStatusCode.Unauthorized, brownieResponse.StatusCode);
    }

    [Test, Order(5)]
    public async Task Backend_Test_Get_Method_Get_BrownieById_In_Brownie_Service_Fetches_Brownie_Successfully()
    {
        // Arrange
        ClearDatabase();

        var brownieData = new Dictionary<string, object>
        {
            { "Id", 100 }, // This ID will be used to retrieve the brownie
            { "Name", "Classic Fudge Brownie" },
            { "Description", "Rich chocolate fudge brownie" },
            { "Price", 2.99m },
            { "ImageUrl", "https://example.com/fudge.jpg" },
            { "StockCount", 15 }
        };

        var brownieInstance = new Brownie();
        foreach (var kvp in brownieData)
        {
            var prop = typeof(Brownie).GetProperty(kvp.Key);
            if (prop != null)
            {
                prop.SetValue(brownieInstance, kvp.Value);
            }
        }

        _context.Brownies.Add(brownieInstance);
        _context.SaveChanges();

        // Load service and method via reflection
        string assemblyName = "dotnetapp";
        Assembly assembly = Assembly.Load(assemblyName);
        string serviceName = "dotnetapp.Services.BrownieService";

        Type serviceType = assembly.GetType(serviceName);
        MethodInfo getBrownieMethod = serviceType.GetMethod("GetBrownieByIdAsync");

        if (getBrownieMethod != null)
        {
            var serviceInstance = Activator.CreateInstance(serviceType, _context);
            var task = (Task<Brownie>)getBrownieMethod.Invoke(serviceInstance, new object[] { 100 });
            Brownie retrievedBrownie = await task;

            // Assert
            Assert.IsNotNull(retrievedBrownie);
            Assert.AreEqual(brownieInstance.Name, retrievedBrownie.Name);
        }
        else
        {
            Assert.Fail("GetBrownieByIdAsync method not found.");
        }
    }

    [Test, Order(6)]
    public async Task Backend_Test_Put_Method_Update_Brownie_In_Brownie_Service_Updates_Brownie_Successfully()
    {
        // Arrange
        ClearDatabase();

        var originalBrownieData = new Dictionary<string, object>
        {
            { "Id", 101 },
            { "Name", "Walnut Brownie" },
            { "Description", "A rich chocolate brownie with crunchy walnuts." },
            { "Price", 3.49m },
            { "ImageUrl", "https://example.com/walnut.jpg" },
            { "StockCount", 20 }
        };

        var brownieInstance = new Brownie();
        foreach (var kvp in originalBrownieData)
        {
            var prop = typeof(Brownie).GetProperty(kvp.Key);
            if (prop != null)
            {
                prop.SetValue(brownieInstance, kvp.Value);
            }
        }

        _context.Brownies.Add(brownieInstance);
        _context.SaveChanges();

        // Load BrownieService via reflection
        string assemblyName = "dotnetapp";
        Assembly assembly = Assembly.Load(assemblyName);
        string serviceName = "dotnetapp.Services.BrownieService";
        string modelName = "dotnetapp.Models.Brownie";

        Type serviceType = assembly.GetType(serviceName);
        Type modelType = assembly.GetType(modelName);

        MethodInfo updateMethod = serviceType.GetMethod("UpdateBrownieAsync");

        if (updateMethod != null)
        {
            var service = Activator.CreateInstance(serviceType, _context);

            var updatedBrownieData = new Dictionary<string, object>
            {
                { "Id", 101 },
                { "Name", "Walnut Brownie Deluxe" },
                { "Description", "Updated: Now with extra walnuts and chocolate." },
                { "Price", 3.99m },
                { "ImageUrl", "https://example.com/walnut-deluxe.jpg" },
                { "StockCount", 25 }
            };

            var updatedBrownie = Activator.CreateInstance(modelType);
            foreach (var kvp in updatedBrownieData)
            {
                var prop = modelType.GetProperty(kvp.Key);
                if (prop != null)
                {
                    prop.SetValue(updatedBrownie, kvp.Value);
                }
            }

            var updateTask = (Task<bool>)updateMethod.Invoke(service, new object[] { updatedBrownie });
            bool result = await updateTask;

            // Assert
            Assert.IsTrue(result);

            var updatedFromDb = await _context.Brownies.FindAsync(101);
            Assert.IsNotNull(updatedFromDb);
            Assert.AreEqual("Walnut Brownie Deluxe", updatedFromDb.Name);
            Assert.AreEqual("https://example.com/walnut-deluxe.jpg", updatedFromDb.ImageUrl);
        }
        else
        {
            Assert.Fail("UpdateBrownieAsync method not found.");
        }
    }

    [Test, Order(7)]
    public async Task Backend_Test_Delete_Method_Delete_Brownie_In_Brownie_Service_Deletes_Brownie_Successfully()
    {
        ClearDatabase();

        // Arrange: Create and add a brownie
        var brownieData = new Dictionary<string, object>
        {
            { "Id", 303 },
            { "Name", "Caramel Brownie" },
            { "Description", "A fudgy brownie with a gooey caramel center." },
            { "Price", 4.25m },
            { "ImageUrl", "https://example.com/caramel.jpg" },
            { "StockCount", 30 }
        };

        var brownieInstance = new Brownie();
        foreach (var kvp in brownieData)
        {
            var prop = typeof(Brownie).GetProperty(kvp.Key);
            if (prop != null)
            {
                prop.SetValue(brownieInstance, kvp.Value);
            }
        }

        _context.Brownies.Add(brownieInstance);
        _context.SaveChanges();

        // Act: Use reflection to invoke DeleteBrownieAsync
        string assemblyName = "dotnetapp";
        Assembly assembly = Assembly.Load(assemblyName);
        string serviceName = "dotnetapp.Services.BrownieService";

        Type serviceType = assembly.GetType(serviceName);
        MethodInfo deleteMethod = serviceType?.GetMethod("DeleteBrownieAsync", new[] { typeof(int) });

        if (deleteMethod != null)
        {
            var service = Activator.CreateInstance(serviceType, _context);
            var deleteTask = (Task<bool>)deleteMethod.Invoke(service, new object[] { 303 });
            bool result = await deleteTask;

            // Assert
            Assert.IsTrue(result);

            var deletedBrownieFromDb = await _context.Brownies.FindAsync(303);
            Assert.IsNull(deletedBrownieFromDb);
        }
        else
        {
            Assert.Fail("DeleteBrownieAsync method not found.");
        }
    }

    [Test, Order(8)]
    public async Task Backend_Test_Post_Method_AddOrder_In_Order_Service_Posts_Successfully()
    {
        // Clear the test database
        ClearDatabase();

        // Create and add a test user
        var user = new User
        {
            UserId = 400,
            Username = "testuser",
            Password = "testpassword",
            Email = "test@example.com",
            MobileNumber = "1234567890",
            UserRole = "User"
        };
        _context.Users.Add(user);

        // Create and add a test brownie (ImageUrl is required by EF Core model)
        var brownie = new Brownie
        {
            Id = 101,
            Name = "Classic Fudge",
            Description = "Rich chocolate brownie",
            Price = 4.99m,
            ImageUrl = "https://example.com/images/classic-fudge.jpg", // ✅ Add this
            StockCount = 10
        };
        _context.Brownies.Add(brownie);

        await _context.SaveChangesAsync(); // Save user and brownie

        // Create order with one order item
        var order = new Order
        {
            Id = 300,
            UserId = 400, // string as per your model
            OrderDate = DateTime.UtcNow,
            Status = "Pending",
            TotalAmount = 4.99m,
            OrderItems = new List<OrderItem>
            {
                new OrderItem
                {
                    Id = 500,
                    BrownieId = 101,
                    Quantity = 1,
                    Price = 4.99m
                }
            }
        };

        // Create service and add order
        var orderService = new OrderService(_context);
        var result = await orderService.CreateOrderAsync(order);

        // Retrieve and validate saved order
        var savedOrder = await _context.Orders
                                    .Include(o => o.OrderItems)
                                    .FirstOrDefaultAsync(o => o.Id == 300);

        Assert.IsTrue(result, "Order service should return true");
        Assert.IsNotNull(savedOrder, "Order should be saved in the database");
        Assert.AreEqual("Pending", savedOrder.Status);
        Assert.AreEqual(400, savedOrder.UserId);
        Assert.AreEqual(1, savedOrder.OrderItems.Count);
        Assert.AreEqual(4.99m, savedOrder.TotalAmount);
        Assert.AreEqual(101, savedOrder.OrderItems.First().BrownieId);
        Assert.AreEqual(1, savedOrder.OrderItems.First().Quantity);
    }

   [Test, Order(9)]
    public async Task Backend_Test_Get_Method_GetOrderByUserId_In_OrderService_Fetches_Successfully()
    {
        ClearDatabase();

        // Add user
        var user = new User
        {
            UserId = 400, // Ensure UserId is an integer
            Username = "testuser",
            Password = "testpassword",
            Email = "test@example.com",
            MobileNumber = "1234567890",
            UserRole = "User"
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Add brownie
        var brownie = new Brownie
        {
            Id = 101,
            Name = "Classic Fudge",
            Description = "Rich chocolate brownie",
            Price = 4.99m,
            ImageUrl = "https://example.com/images/classic-fudge.jpg",
            StockCount = 10
        };
        _context.Brownies.Add(brownie);
        await _context.SaveChangesAsync();

        // Add order with one item
        var order = new Order
        {
            Id = 300,
            UserId = 400, // Use integer for UserId
            OrderDate = DateTime.UtcNow,
            Status = "Pending",
            TotalAmount = 4.99m,
            OrderItems = new List<OrderItem>
            {
                new OrderItem
                {
                    Id = 500,
                    BrownieId = 101,
                    Quantity = 1,
                    Price = 4.99m
                }
            }
        };
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Create an instance of OrderService
        var orderService = new OrderService(_context);

        // Fetch orders by userId
        var orders = await orderService.GetOrdersByUserIdAsync(400); // Pass an int instead of string

        Assert.IsNotNull(orders);
        Assert.IsTrue(orders.Any());
        Assert.AreEqual(400, orders.First().UserId);
    }

    [Test, Order(10)]
    public async Task Backend_Test_Put_Method_Update_In_Order_Service_Updates_Status_Successfully()
    {
        ClearDatabase();

        // Add user
        var user = new User
        {
            UserId = 400, // Ensure UserId is an integer
            Username = "testuser",
            Password = "testpassword",
            Email = "test@example.com",
            MobileNumber = "1234567890",
            UserRole = "User"
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Add brownie
        var brownie = new Brownie
        {
            Id = 101,
            Name = "Classic Fudge",
            Description = "Rich chocolate brownie",
            Price = 4.99m,
            ImageUrl = "https://example.com/images/classic-fudge.jpg",
            StockCount = 10
        };
        _context.Brownies.Add(brownie);
        await _context.SaveChangesAsync();

        // Add order with one item
        var order = new Order
        {
            Id = 300,
            UserId = 400, // Use integer for UserId
            OrderDate = DateTime.UtcNow,
            Status = "Pending",
            TotalAmount = 4.99m,
            OrderItems = new List<OrderItem>
            {
                new OrderItem
                {
                    Id = 500,
                    BrownieId = 101,
                    Quantity = 1,
                    Price = 4.99m
                }
            }
        };
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Create an instance of OrderService
        var orderService = new OrderService(_context);

        // Update order: change the status to 'Confirmed'
        var updatedOrder = new Order
        {
            Id = 300,
            UserId = 400, // Use integer for UserId
            OrderDate = DateTime.UtcNow,
            Status = "Confirmed", // Status change
            TotalAmount = 4.99m, // Ensure total amount remains unchanged
            OrderItems = order.OrderItems // No changes to OrderItems
        };

        // Recalculate the total amount based on the updated order items (if needed)
        updatedOrder.TotalAmount = updatedOrder.OrderItems.Sum(oi => oi.Quantity * oi.Price);

        // Perform the update operation
        var result = await orderService.UpdateOrderAsync(updatedOrder);

        // Assert that the update was successful
        Assert.IsTrue(result);

        // Fetch the updated order from the database
        var updated = await _context.Orders
                                    .Include(o => o.OrderItems)
                                    .FirstOrDefaultAsync(o => o.Id == 300);

        // Assert the updated status
        Assert.AreEqual("Confirmed", updated.Status);

        // Assert that the OrderItems and TotalAmount remain unchanged
        Assert.AreEqual(1, updated.OrderItems.Count); // Ensure the same number of items
        Assert.AreEqual(4.99m, updated.TotalAmount);  // Ensure the total amount is unchanged
    }

    [Test, Order(11)]
    public async Task Backend_Test_Delete_Method_DeleteOrder_Service_Deletes_Order_Successfully()
    {
        ClearDatabase();

        // Add user
        var user = new User
        {
            UserId = 32,
            Username = "testuser",
            Password = "testpassword",
            Email = "test@example.com",
            MobileNumber = "1234567890",
            UserRole = "User"
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Add brownie
        var brownie = new Brownie
        {
            Id = 101,
            Name = "Classic Fudge",
            Description = "Rich chocolate brownie",
            Price = 4.99m,
            ImageUrl = "https://example.com/images/classic-fudge.jpg",
            StockCount = 10
        };
        _context.Brownies.Add(brownie);
        await _context.SaveChangesAsync();

        // Add order with one item
        var order = new Order
        {
            Id = 300,
            UserId = 32, // Ensure UserId matches the user
            OrderDate = DateTime.UtcNow,
            Status = "Pending",
            TotalAmount = 4.99m,
            OrderItems = new List<OrderItem>
            {
                new OrderItem
                {
                    Id = 500,
                    BrownieId = 101,
                    Quantity = 1,
                    Price = 4.99m
                }
            }
        };
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Reflection to call DeleteOrderAsync method
        string assemblyName = "dotnetapp";
        Assembly assembly = Assembly.Load(assemblyName);
        string serviceName = "dotnetapp.Services.OrderService";
        Type serviceType = assembly.GetType(serviceName);

        MethodInfo deleteMethod = serviceType.GetMethod("DeleteOrderAsync", new[] { typeof(int) });

        if (deleteMethod != null)
        {
            var service = Activator.CreateInstance(serviceType, _context);
            var resultTask = (Task<bool>)deleteMethod.Invoke(service, new object[] { 300 });
            bool result = await resultTask;

            // Assert that the result of the delete operation is true
            Assert.IsTrue(result);

            // Assert that the order is deleted from the database
            var deletedOrder = await _context.Orders.FindAsync(300);
            Assert.IsNull(deletedOrder);
        }
        else
        {
            Assert.Fail("DeleteOrderAsync method not found.");
        }

        ClearDatabase();
    }

    [Test, Order(12)]
    public async Task Backend_Test_Post_Method_AddFeedback_In_Feedback_Service_Posts_Successfully()
    {
        ClearDatabase();

        // Step 1: Add a test user
        var userData = new Dictionary<string, object>
        {
            { "UserId", 42 },
            { "Username", "testuser" },
            { "Password", "testpassword" },
            { "Email", "test@example.com" },
            { "MobileNumber", "1234567890" },
            { "UserRole", "User" }
        };

        var user = new User();
        foreach (var kvp in userData)
        {
            var propertyInfo = typeof(User).GetProperty(kvp.Key);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(user, kvp.Value);
            }
        }

        _context.Users.Add(user);
        _context.SaveChanges();

        // Step 2: Prepare reflection for FeedbackService.AddFeedback()
        string assemblyName = "dotnetapp";
        Assembly assembly = Assembly.Load(assemblyName);
        string serviceName = "dotnetapp.Services.FeedbackService";
        string modelName = "dotnetapp.Models.Feedback";

        Type serviceType = assembly.GetType(serviceName);
        Type modelType = assembly.GetType(modelName);

        MethodInfo method = serviceType?.GetMethod("AddFeedback", new[] { modelType });

        if (method != null)
        {
            // Step 3: Create feedback instance with test data
            var feedbackData = new Dictionary<string, object>
            {
                { "FeedbackId", 11 },
                { "UserId", 42 },
                { "FeedbackText", "Great experience!" },
                { "Date", DateTime.Now }
            };

            var feedback = new Feedback();
            foreach (var kvp in feedbackData)
            {
                var propertyInfo = typeof(Feedback).GetProperty(kvp.Key);
                if (propertyInfo != null)
                {
                    propertyInfo.SetValue(feedback, kvp.Value);
                }
            }

            // Step 4: Call AddFeedback() method via reflection
            var service = Activator.CreateInstance(serviceType, _context);
            var resultTask = (Task<bool>)method.Invoke(service, new object[] { feedback });
            var result = await resultTask;

            // Step 5: Assert result and database state
            var addedFeedback = await _context.Feedbacks.FindAsync(11);
            Assert.IsNotNull(addedFeedback);
            Assert.AreEqual("Great experience!", addedFeedback.FeedbackText);
            Assert.AreEqual(42, addedFeedback.UserId);
        }
        else
        {
            Assert.Fail("Method AddFeedback not found.");
        }

        ClearDatabase();
    }

    [Test, Order(13)]
    public async Task Backend_Test_Delete_Method_Feedback_In_Feedback_Service_Deletes_Successfully()
    {
        ClearDatabase();

        // Step 1: Add a test user
        var userData = new Dictionary<string, object>
        {
            { "UserId", 42 },
            { "Username", "testuser" },
            { "Password", "testpassword" },
            { "Email", "test@example.com" },
            { "MobileNumber", "1234567890" },
            { "UserRole", "User" }
        };

        var user = new User();
        foreach (var kvp in userData)
        {
            var propertyInfo = typeof(User).GetProperty(kvp.Key);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(user, kvp.Value);
            }
        }
        _context.Users.Add(user);
        _context.SaveChanges();

        // Step 2: Add test feedback
        var feedbackData = new Dictionary<string, object>
        {
            { "FeedbackId", 11 },
            { "UserId", 42 },
            { "FeedbackText", "Great experience!" },
            { "Date", DateTime.Now }
        };

        var feedback = new Feedback();
        foreach (var kvp in feedbackData)
        {
            var propertyInfo = typeof(Feedback).GetProperty(kvp.Key);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(feedback, kvp.Value);
            }
        }
        _context.Feedbacks.Add(feedback);
        _context.SaveChanges();

        // Step 3: Delete the feedback using FeedbackService
        string assemblyName = "dotnetapp";
        Assembly assembly = Assembly.Load(assemblyName);
        string serviceName = "dotnetapp.Services.FeedbackService";

        Type serviceType = assembly.GetType(serviceName);
        MethodInfo deleteMethod = serviceType?.GetMethod("DeleteFeedback", new[] { typeof(int) });

        if (deleteMethod != null)
        {
            var service = Activator.CreateInstance(serviceType, _context);
            var deleteTask = (Task<bool>)deleteMethod.Invoke(service, new object[] { 11 });
            var result = await deleteTask;

            // Step 4: Verify feedback was deleted
            var deletedFeedback = await _context.Feedbacks.FindAsync(11);
            Assert.IsTrue(result);
            Assert.IsNull(deletedFeedback);
        }
        else
        {
            Assert.Fail("DeleteFeedback method not found.");
        }

        ClearDatabase();
    }

    [Test, Order(14)]
    public async Task Backend_Test_Get_Method_GetFeedbacksByUserId_In_Feedback_Service_Fetches_Successfully()
    {
        ClearDatabase();

        // Step 1: Add a test user
        var user = new User
        {
            UserId = 330,
            Username = "testuser",
            Password = "testpassword",
            Email = "test@example.com",
            MobileNumber = "1234567890",
            UserRole = "User"
        };
        _context.Users.Add(user);
        _context.SaveChanges();

        // Step 2: Add a feedback entry
        var feedback = new Feedback
        {
            FeedbackId = 13,
            UserId = 330,
            FeedbackText = "Great experience!",
            Date = DateTime.Now
        };
        _context.Feedbacks.Add(feedback);
        _context.SaveChanges();

        // Step 3: Use reflection to access FeedbackService and call GetFeedbacksByUserId
        string assemblyName = "dotnetapp";
        Assembly assembly = Assembly.Load(assemblyName);
        string serviceName = "dotnetapp.Services.FeedbackService";

        Type serviceType = assembly.GetType(serviceName);
        MethodInfo method = serviceType?.GetMethod("GetFeedbacksByUserId");

        if (method != null)
        {
            var service = Activator.CreateInstance(serviceType, _context);
            var resultTask = (Task<IEnumerable<Feedback>>)method.Invoke(service, new object[] { 330 });
            var feedbacks = await resultTask;

            Assert.IsNotNull(feedbacks);
            var feedbackList = feedbacks.ToList();

            Assert.IsTrue(feedbackList.Any(), "No feedbacks returned for the user.");
            Assert.AreEqual(1, feedbackList.Count);
            Assert.AreEqual("Great experience!", feedbackList[0].FeedbackText);
            Assert.AreEqual(330, feedbackList[0].UserId);
        }
        else
        {
            Assert.Fail("Method GetFeedbacksByUserId not found.");
        }

        ClearDatabase();
    }

    [Test, Order(15)]
    public async Task Backend_Test_Post_Method_AddOrder_Throws_OrderException_If_Stock_Is_Insufficient()
    {
        // Arrange: Clear DB and prepare test data
        ClearDatabase();

        var contextOptions = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase("TestDB_InsufficientStock")
            .Options;

        using var context = new ApplicationDbContext(contextOptions);
        var service = new OrderService(context);

        // Add brownie with limited stock
        var brownie = new Brownie
        {
            Id = 101,
            Name = "Classic Fudge",
            Description = "Rich chocolate brownie",
            Price = 4.99m,
            ImageUrl = "https://example.com/images/classic-fudge.jpg",
            StockCount = 1 // Only 1 in stock
        };
        context.Brownies.Add(brownie);
        await context.SaveChangesAsync();

        // Create an order that requests more than available stock
        var order = new Order
        {
            Id = 300,
            UserId = 32,
            OrderDate = DateTime.UtcNow,
            Status = "Pending",
            TotalAmount = 9.98m,
            OrderItems = new List<OrderItem>
            {
                new OrderItem
                {
                    Id = 500,
                    BrownieId = 101,
                    Quantity = 2, // Requesting 2, but only 1 in stock
                    Price = 4.99m
                }
            }
        };

        // Act & Assert
        var ex = Assert.ThrowsAsync<OrderException>(async () => await service.CreateOrderAsync(order));
        Assert.That(ex.Message, Is.EqualTo("Insufficient stock for brownie: Classic Fudge"));
    }

private void ClearDatabase()
{
    _context.Database.EnsureDeleted();
    _context.Database.EnsureCreated();
}

}
}