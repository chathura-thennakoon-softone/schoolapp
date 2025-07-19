namespace SCH.Core.DependancyConfiguration
{
    using Microsoft.Extensions.DependencyInjection;
    using SCH.Services;
    using System.Reflection;

    public static class ServiceConfiguration
    {
        public static void AddServices(this IServiceCollection services)
        {
            Assembly assembly = Assembly.Load("SCH.Services");

            Type superInterfaceType = typeof(IService);

            IEnumerable<Type> types = assembly.GetTypes()
                .Where(t => 
                    superInterfaceType.IsAssignableFrom(t) 
                    && !t.IsInterface 
                    && !t.IsAbstract);

            foreach (Type type in types)
            {
                Type parentInteface = type.GetInterfaces()
                    .Single(i =>
                        i.GetInterfaces()
                        .Any(ip => ip == superInterfaceType));

                services.AddScoped(parentInteface, type);
            }

        }
    }
}
