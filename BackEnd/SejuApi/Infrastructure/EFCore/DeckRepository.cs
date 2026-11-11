using Domain.Dto.Request;
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
    public class DeckRepository : RepositoryBase<Deck>, IDeckRepository
    {
        public DeckRepository(RepositoryContext context) : base(context)
        {
        }

        public void CreateDeck(Deck deck) => Create(deck);


        public void DeleteDeck(Deck deck) => Delete(deck);



        public async Task<IEnumerable<Deck>> GetUserByAllDecks(string userId,bool trackChanges)
        {
            return await FindByCondition(d =>d.UserId ==userId,trackChanges)
                .OrderBy(d=>d.Name)
                .ToListAsync();
        }

        public async Task<Deck> GetDecksByUserId(string userId, bool trackChanges)
        {
           return await FindByCondition(x => x.Id.Equals(userId), trackChanges).SingleOrDefaultAsync();
        }

        public void UpdateDeck(Deck deck) => Update(deck);

    }
}