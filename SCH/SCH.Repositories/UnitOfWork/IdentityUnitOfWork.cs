namespace SCH.Repositories.UnitOfWork
{
    using SCH.Repositories.DbContexts;

    /// <summary>
    /// Unit of Work implementation for Identity context transactions
    /// </summary>
    internal class IdentityUnitOfWork : IIdentityUnitOfWork
    {
        private readonly IdentityContext _context;

        public IdentityUnitOfWork(IdentityContext context)
        {
            _context = context;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}

