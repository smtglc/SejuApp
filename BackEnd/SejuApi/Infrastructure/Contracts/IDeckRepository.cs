using Domain.Dto.Request;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Contracts
{
    public interface IDeckRepository : IRepositoryBase<Deck>
    {
        Task<IEnumerable<Deck>> GetUserByAllDecks(string userId,bool trackChanges);
        Task<Deck> GetDecksByUserId(string userId, bool trackChanges);
        void CreateDeck(Deck deck);
        void UpdateDeck (Deck deck);
        void DeleteDeck(Deck deck);
    }
}
