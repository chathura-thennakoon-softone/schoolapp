namespace SCH.Repositories.DbContexts
{
    using Microsoft.EntityFrameworkCore;

    public class SCHContext : DbContext
    {
        public SCHContext(DbContextOptions<SCHContext> options)
            : base(options)
        {
        }

    }
}
