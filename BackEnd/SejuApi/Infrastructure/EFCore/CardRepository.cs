using Domain.Models;
using Infrastructure.Contracts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.EFCore
{
    public class CardRepository : RepositoryBase<Card>, ICardRepository
    {
        public CardRepository(RepositoryContext context) : base(context)
        {
        }

        public void CreateCard(Card card) => Create(card);

        public async Task<List<Card>> GetAllCardsByDeckIdAsync(Guid deckId, bool trackChanges)
        {
            return await FindByCondition(x => x.DeckId.Equals(deckId), trackChanges)
                 .OrderBy(x => x.Word)
                 .ToListAsync();
        }

        public async Task<Card> GetCardByIdAsync(Guid cardId, bool trackChanges)
        {
            return await FindByCondition(x =>x.Id.Equals(cardId), trackChanges)
                .SingleOrDefaultAsync();
        }
        public async Task DeleteCard(Card card) => Delete(card);
        

        
    }
}
