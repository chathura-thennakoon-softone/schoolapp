namespace SCH.Models.Users.ClientDtos
{
    /// <summary>
    /// DTO for domain user information
    /// </summary>
    public class UserDomainDto
    {
        /// <summary>
        /// Domain user ID
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Reference to Identity user ID
        /// </summary>
        public int AspNetUserId { get; set; }

        /// <summary>
        /// First name
        /// </summary>
        public string FirstName { get; set; } = string.Empty;

        /// <summary>
        /// Last name
        /// </summary>
        public string LastName { get; set; } = string.Empty;

        /// <summary>
        /// Full name
        /// </summary>
        public string FullName { get; set; } = string.Empty;

        // Add DTOs for any additional domain properties
    }
}

