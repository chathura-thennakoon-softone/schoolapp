namespace SCH.Repositories.Users
{
    using SCH.Models.Users.Entities;

    /// <summary>
    /// Repository interface for User entity (domain user table)
    /// </summary>
    public interface IUserRepository : IRepository
    {
        /// <summary>
        /// Gets a user by their AspNetUserId
        /// </summary>
        Task<User?> GetByAspNetUserIdAsync(int aspNetUserId);

        /// <summary>
        /// Gets a user by their domain user ID
        /// </summary>
        Task<User?> GetByIdAsync(int id);

        /// <summary>
        /// Inserts a new user
        /// </summary>
        Task InsertAsync(User user);

        /// <summary>
        /// Updates an existing user
        /// </summary>
        void Update(User user);

        /// <summary>
        /// Deletes a user
        /// </summary>
        Task DeleteAsync(int id);
    }
}

