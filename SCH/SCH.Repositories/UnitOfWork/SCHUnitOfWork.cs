using SCH.Repositories.DbContexts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SCH.Repositories.UnitOfWork
{
    internal class SCHUnitOfWork : ISCHUnitOfWork
    {
        private readonly SCHContext context;

        public SCHUnitOfWork(SCHContext context)
        {
            this.context = context;
        }

        public async Task SaveChangesAsync()
        {
            await context.SaveChangesAsync();
        }
    }
}
