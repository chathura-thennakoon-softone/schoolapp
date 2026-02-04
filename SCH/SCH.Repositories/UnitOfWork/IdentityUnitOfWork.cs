namespace SCH.Repositories.UnitOfWork
{
    using Microsoft.EntityFrameworkCore;
    using SCH.Models.Common.AuditableEntities;
    using SCH.Repositories.DbContexts;
    using SCH.Shared.HttpContext;

    /// <summary>
    /// Unit of Work implementation for Identity context transactions
    /// </summary>
    internal class IdentityUnitOfWork : IIdentityUnitOfWork
    {
        private readonly IdentityContext _context;
        private readonly IUserInfo? _userInfo;

        public IdentityUnitOfWork(IdentityContext context, IUserInfo? userInfo = null)
        {
            _context = context;
            _userInfo = userInfo;
        }

        public async Task SaveChangesAsync()
        {
            // Apply audit tracking before saving
            var currentUserId = _userInfo?.GetCurrentUserId();
            var timestamp = DateTime.UtcNow; // Single timestamp for all entities in this transaction
            var entries = _context.ChangeTracker.Entries<IIdentityAuditableEntity>();

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    // Set CreatedDate if not already set
                    if (entry.Entity.CreatedDate == default)
                        entry.Entity.CreatedDate = timestamp;

                    // Set CreatedBy if user is authenticated (nullable for self-referencing)
                    if (currentUserId.HasValue)
                        entry.Entity.CreatedBy = currentUserId.Value;
                }
                else if (entry.State == EntityState.Modified)
                {
                    // Set ModifiedBy and ModifiedDate if user is authenticated
                    if (currentUserId.HasValue)
                    {
                        entry.Entity.ModifiedBy = currentUserId.Value;
                        entry.Entity.ModifiedDate = timestamp;
                    }
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}

