using Application.Contract;
using Domain.Dto;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IServiceManager _serviceManager;

        public AuthenticationController(IServiceManager serviceManager)
        {
            _serviceManager = serviceManager;
        }
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] UserRegisterForDto registerForDto)
        {
            var result = await _serviceManager.AuthenticationService.RegisterUserAsync(registerForDto);
            if (result.Succeeded)
            {
                return Ok(new { Message = "User registered successfully." });
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }
        [HttpPost("login")]
        public async Task<IActionResult> Authenticate([FromBody] UserForAuthenticationDto user)
        {
            if (!await _serviceManager.AuthenticationService.ValidateUser(user))
                return Unauthorized(); // 401

            var tokenDto = await _serviceManager
                .AuthenticationService
                .CreateToken(populateExp: true);

            return Ok(tokenDto);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] TokenDto tokenDto)
        {
            var tokenDtoToReturn = await _serviceManager
                .AuthenticationService
                .RefreshToken(tokenDto);
            return Ok(tokenDtoToReturn);
        }
    }

}

