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
        Task<ResponseDeckDto> GetOneDeckByIdAsync(Guid deckId,string userId,bool trackChanges);
        Task<IEnumerable<ResponseDeckDto>> GetUserByAllDecks(string userId,bool trackChanges);
        Task<ResponseDeckDto> CreateDeck(CreateDeckDto deckDto,string userId);
        Task UpdateDeck(UpdateForDeckDto deckDto,string userId,Guid deckId);
        Task DeleteDeck(Guid deckId,string userId);
    }
}
