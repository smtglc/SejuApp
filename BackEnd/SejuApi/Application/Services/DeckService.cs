using Application.Contract;
using AutoMapper;
using Domain.Dto.Request;
using Domain.Dto.Response;
using Domain.Models;
using Infrastructure.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class DeckService : IDeckService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;
        public DeckService(IRepositoryManager repositoryManager,IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }
        public async Task<ResponseDeckDto> CreateDeck(CreateDeckDto deckDto,string userId)
        {
           var deck = _mapper.Map<Deck>(deckDto);
            deck.UserId =userId;
            _repositoryManager.Deck.CreateDeck(deck);
           await _repositoryManager.SaveAsync();
            return _mapper.Map<ResponseDeckDto>(deck);
        }

        public void DeleteDeck(Deck deck)
        {
            throw new NotImplementedException();
        }

        public Task<Deck> GetOneDeckByIdAsync(string userId, bool trackChanges)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<ResponseDeckDto>> GetUserByAllDecks(string userId, bool trackChanges)
        {
           var decks=await _repositoryManager.Deck.GetUserByAllDecks(userId,trackChanges);
            return _mapper.Map<IEnumerable<ResponseDeckDto>>(decks);
        }

        public void UpdateDeck(UpdateForDeckDto deckDto)
        {
            throw new NotImplementedException();
        }
    }
}
