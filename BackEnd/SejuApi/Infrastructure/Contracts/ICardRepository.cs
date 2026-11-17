using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Contracts
{
    public interface ICardRepository :IRepositoryBase<Card> 
    {
        Task<List<Card>> GetAllCardsByDeckIdAsync(Guid deckId, bool trackChanges);
        Task<Card> GetCardByIdAsync(Guid cardId, bool trackChanges);
         void CreateCard(Card card);
        Task DeleteCard(Card card);
    }
}
