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
    public interface ICardService
    {
        Task<List<ResponseCardDto>> GetAllCardsByDeckIdAsync(Guid deckId, bool trackChanges);
        Task<ResponseCardDto> GetCardByIdAsync(Guid cardId, bool trackChanges);
        Task CreateCard(CreateCardDto cardDto,string userId,Guid deckId);
        Task DeleteCard(Guid cardId);
    }
}
