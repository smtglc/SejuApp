using Application.Contract;
using AutoMapper;
using Domain.Dto.Request;
using Domain.Dto.Response;
using Domain.Models;
using Infrastructure.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class CardService : ICardService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public CardService(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task CreateCard(CreateCardDto cardDto,string userId,Guid deckId)
        {
            var deckControl =await _repositoryManager.Deck.GetDecksByUserIdAsync(deckId,userId, false);
            if (deckControl == null)
            {
                throw new Exception("Deck not found or does not belong to the user.");
            }
            var card = _mapper.Map<Card>(cardDto);
            card.DeckId = deckId;
            _repositoryManager.Card.CreateCard(card);
          await  _repositoryManager.SaveAsync();

        }

        public async Task DeleteCard(Guid cardId)
        {
            var getCard =await _repositoryManager.Card.GetCardByIdAsync(cardId, false);
           var card = _mapper.Map<Card>(getCard);
          await  _repositoryManager.Card.DeleteCard(card);
         await   _repositoryManager.SaveAsync();

        }

        public async Task<List<ResponseCardDto>> GetAllCardsByDeckIdAsync(Guid deckId, bool trackChanges)
        {
            var cards =await _repositoryManager.Card.GetAllCardsByDeckIdAsync(deckId, trackChanges);
            if(cards == null)
            {
                throw new Exception("No cards found for the specified deck.");
            }
            
            return  _mapper.Map<List<ResponseCardDto>>(cards);
        }

        public async Task<ResponseCardDto> GetCardByIdAsync(Guid cardId, bool trackChanges)
        {
            var card =await _repositoryManager.Card.GetCardByIdAsync(cardId, trackChanges);
            if(card == null)
            {
                throw new Exception("Card not found.");
            }
            return _mapper.Map<ResponseCardDto>(card);
        }
    }
}
