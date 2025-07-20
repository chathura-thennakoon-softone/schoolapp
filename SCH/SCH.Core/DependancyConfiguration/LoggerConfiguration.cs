namespace SCH.Core.DependancyConfiguration
{
    using Microsoft.Extensions.DependencyInjection;
    using SCH.Shared.Logger;

    public static class LoggerConfiguration
    {
        public static void AddLogger(this IServiceCollection services)
        {
            services.AddSingleton(typeof(ILogger<>), typeof(Logger<>));
        }
    }
}
