namespace SCH.Core.DependancyConfiguration
{
    using Microsoft.Extensions.DependencyInjection;
    using SCH.Repositories;
    using System.Reflection;

    public static class RepositoriesConfiguration
    {
        public static void AddRepositories(this IServiceCollection services)
        {
            Assembly assembly = Assembly.Load("SCH.Repositories");

            Type superInterfaceType = typeof(IRepository);

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
