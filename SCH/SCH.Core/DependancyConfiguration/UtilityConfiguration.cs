namespace SCH.Core.DependancyConfiguration
{
    using Microsoft.Extensions.DependencyInjection;
    using SCH.Shared.Utility;
    using System.Reflection;

    public static class UtilityConfiguration
    {
        public static void AddUtilities(this IServiceCollection services)
        {
            Assembly assembly = Assembly.Load("SCH.Shared");

            Type superInterfaceType = typeof(IUtility);

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
