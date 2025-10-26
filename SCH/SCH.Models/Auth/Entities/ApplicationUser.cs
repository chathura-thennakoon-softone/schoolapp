namespace SCH.Models.Auth.Entities
{
    using Microsoft.AspNetCore.Identity;

    /// <summary>
    /// Represents an application user with custom properties
    /// </summary>
    public class ApplicationUser : IdentityUser<int>
    {
        /// <summary>
        /// User's first name
        /// </summary>
        public string FirstName { get; set; } = string.Empty;

        /// <summary>
        /// User's last name
        /// </summary>
        public string LastName { get; set; } = string.Empty;

        /// <summary>
        /// Indicates if the user account is active
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Date when the user was created
        /// </summary>
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Last login date and time
        /// </summary>
        public DateTime? LastLoginDate { get; set; }

        /// <summary>
        /// Navigation property for refresh tokens
        /// </summary>
        public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

        /// <summary>
        /// Gets the user's full name
        /// </summary>
        public string FullName => $"{FirstName} {LastName}".Trim();
    }
}

