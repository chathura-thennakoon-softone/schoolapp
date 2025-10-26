namespace SCH.Models.Users.Entities
{
    /// <summary>
    /// Domain user entity - contains domain-specific user information
    /// References ApplicationUser from Identity schema
    /// </summary>
    public class User
    {
        /// <summary>
        /// Unique identifier for the domain user
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Reference to AspNetUsers.Id in identity schema
        /// </summary>
        public int AspNetUserId { get; set; }

        /// <summary>
        /// User's first name
        /// </summary>
        public string FirstName { get; set; } = string.Empty;

        /// <summary>
        /// User's last name
        /// </summary>
        public string LastName { get; set; } = string.Empty;

        /// <summary>
        /// Full name computed property
        /// </summary>
        public string FullName => $"{FirstName} {LastName}".Trim();

    }
}

