using Application.Contract;
using Domain.Dto.Request;
using Domain.Dto.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CardController : ControllerBase
    {
        private readonly IServiceManager _serviceManager;
        public CardController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }
        [Authorize]
        [HttpGet("{deckId}")]
        public async Task<List<ResponseCardDto>> GetAllCards(Guid deckId)
        {
            var cards = await _serviceManager.CardService.GetAllCardsByDeckIdAsync(deckId, false);
            return cards;
        }
        [Authorize]
        [HttpPost("{deckId}")]
        public async Task<IActionResult> CreateOneCard([FromBody] CreateCardDto cardDto,Guid deckId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }
           await _serviceManager.CardService.CreateCard(cardDto,userId,deckId);
            return StatusCode(201);
        }
        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteCard(Guid cardId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }
            await _serviceManager.CardService.DeleteCard(cardId);
            return StatusCode(200);
        }


    }
}
