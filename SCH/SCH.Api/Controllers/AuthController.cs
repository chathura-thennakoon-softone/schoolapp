namespace SCH.API.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using SCH.Models.Auth.ClientDtos;
    using SCH.Services.Auth;
    using System.Security.Claims;

    /// <summary>
    /// Authentication and authorization controller
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
        }

        /// <summary>
        /// Login endpoint - authenticates user and returns JWT tokens
        /// </summary>
        /// <param name="request">Login credentials</param>
        /// <returns>JWT access token and refresh token</returns>
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(
            [FromBody] LoginRequestDto request,
            [FromHeader(Name = "User-Agent")] string? userAgent = null)
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();

            var response = await _authService.LoginAsync(request, ipAddress, userAgent);

            return Ok(response);
        }

        /// <summary>
        /// Register endpoint - creates a new user account
        /// </summary>
        /// <param name="request">Registration details</param>
        /// <returns>JWT access token and refresh token</returns>
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            var response = await _authService.RegisterAsync(request);

            return Ok(response);
        }

        /// <summary>
        /// Refresh token endpoint - gets a new access token using refresh token
        /// </summary>
        /// <param name="request">Access token and refresh token</param>
        /// <returns>New JWT access token and refresh token</returns>
        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> RefreshToken(
            [FromBody] RefreshTokenRequestDto request,
            [FromHeader(Name = "User-Agent")] string? userAgent = null)
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();

            var response = await _authService.RefreshTokenAsync(request, ipAddress, userAgent);

            return Ok(response);
        }

        /// <summary>
        /// Logout endpoint - revokes all user's refresh tokens
        /// </summary>
        /// <returns>Success message</returns>
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            var userId = GetCurrentUserId();

            await _authService.LogoutAsync(userId);

            return Ok(new { message = "Logged out successfully" });
        }

        /// <summary>
        /// Get current user information
        /// </summary>
        /// <returns>Current user details</returns>
        [HttpGet("me")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            var userId = GetCurrentUserId();
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();

            return Ok(new
            {
                id = userId,
                username,
                email,
                roles
            });
        }

        /// <summary>
        /// Get all active sessions for the current user
        /// </summary>
        /// <returns>List of active sessions</returns>
        [HttpGet("sessions")]
        [Authorize]
        public async Task<IActionResult> GetActiveSessions()
        {
            var userId = GetCurrentUserId();
            var sessions = await _authService.GetActiveSessionsAsync(userId);

            return Ok(sessions);
        }

        /// <summary>
        /// Revoke a specific session (refresh token)
        /// </summary>
        /// <param name="sessionId">Session ID (RefreshToken ID)</param>
        /// <returns>Success message</returns>
        [HttpDelete("sessions/{sessionId}")]
        [Authorize]
        public async Task<IActionResult> RevokeSession(int sessionId)
        {
            var userId = GetCurrentUserId();

            await _authService.RevokeTokenAsync(sessionId, userId);

            return Ok(new { message = "Session revoked successfully" });
        }

        /// <summary>
        /// Change password for the current user
        /// </summary>
        /// <param name="request">Current and new password</param>
        /// <returns>Success message</returns>
        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto request)
        {
            var userId = GetCurrentUserId();

            await _authService.ChangePasswordAsync(userId, request);

            return Ok(new { message = "Password changed successfully. Please log in again." });
        }

        /// <summary>
        /// Test endpoint to verify authentication
        /// </summary>
        /// <returns>Success message</returns>
        [HttpGet("test-auth")]
        [Authorize]
        public IActionResult TestAuth()
        {
            return Ok(new { message = "You are authenticated!" });
        }

        /// <summary>
        /// Test endpoint to verify admin role
        /// </summary>
        /// <returns>Success message</returns>
        [HttpGet("test-admin")]
        [Authorize(Roles = "Admin")]
        public IActionResult TestAdmin()
        {
            return Ok(new { message = "You are an admin!" });
        }

        /// <summary>
        /// Helper method to get current user ID from claims
        /// </summary>
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                throw new UnauthorizedAccessException("User ID not found in token");
            }
            return int.Parse(userIdClaim);
        }
    }
}

