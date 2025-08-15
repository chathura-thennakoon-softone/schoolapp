namespace SCH.Repositories.DbContexts
{
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Design;
    using Microsoft.Extensions.Configuration;

    public class SCHContextFactory : IDesignTimeDbContextFactory<SCHContext>
    {
        public SCHContext CreateDbContext(string[] args)
        {
            // Build configuration
            string basePath = Path.Combine(Directory.GetCurrentDirectory(), "../SCH.Api");
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .Build();


            // Get connection string (replace "DefaultConnection" with your key)
            string? connectionString = configuration.GetConnectionString("DefaultConnection");

            DbContextOptionsBuilder<SCHContext> optionsBuilder 
                = new DbContextOptionsBuilder<SCHContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new SCHContext(optionsBuilder.Options);
        }
    }
}