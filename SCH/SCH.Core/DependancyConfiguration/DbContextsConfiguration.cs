namespace SCH.Core.DependancyConfiguration
{
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;
    using SCH.Repositories.DbContexts;

    public static class DbContextsConfiguration
    {
        public static void AddDbContexts(
            this IServiceCollection services, string? connectionString)
        {
            services.AddDbContext<SCHContext>(options =>
                options.UseSqlServer(connectionString));

        }
    }
}
