using Domain.Dto.Request;
using Domain.Dto.Response;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contract
{
    public interface IDeckService
    {
        Task<Deck> GetOneDeckByIdAsync(string userId,bool trackChanges);
        Task<IEnumerable<ResponseDeckDto>> GetUserByAllDecks(string userId,bool trackChanges);
        Task<ResponseDeckDto> CreateDeck(CreateDeckDto deckDto,string userId);
        void UpdateDeck(UpdateForDeckDto deckDto);
        void DeleteDeck(Deck deck);
    }
}
