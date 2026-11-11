using Infrastructure.Contracts;
using Microsoft.EntityFrameworkCore.Query.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.EFCore
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly Lazy<IDeckRepository> _deckRepository;
        private readonly RepositoryContext _context;
        public RepositoryManager(RepositoryContext context)
        {
            _context = context;
            _deckRepository = new Lazy<IDeckRepository>(() => new DeckRepository(_context));
        }

        public IDeckRepository Deck => _deckRepository.Value;

        public async Task SaveAsync() =>await _context.SaveChangesAsync();

    }
}
