using Application.Contract;
using Domain.Dto.Request;
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
    public class DeckController : ControllerBase
    {
        private readonly IServiceManager _serviceManager;

        public DeckController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }
        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> CreateDeck([FromBody] CreateDeckDto deckForCreationDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var deck =  await _serviceManager.DeckService.CreateDeck(deckForCreationDto,userId);
            return StatusCode(201, deck);
        }
        [Authorize]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllDecks()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }
            var decks = await _serviceManager.DeckService.GetUserByAllDecks(userId, trackChanges: false);
            return Ok(decks);
        }
    }
}
