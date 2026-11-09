using Application.Contract;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Domain.Dto;
using Domain.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class AuthenticationManager :IAuthenticationService
    {
        private readonly ILoggerService _logger;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;

        public AuthenticationManager(ILoggerService logger, IMapper mapper, UserManager<User> userManager, IConfiguration configuration)
        {
            _logger = logger;
            _mapper = mapper;
            _userManager = userManager;
            _configuration = configuration;
        }
        public async Task<IdentityResult> RegisterUserAsync(UserRegisterForDto registerForDto)
        {
            var user = _mapper.Map<User>(registerForDto);
            var result = await _userManager.CreateAsync(user, registerForDto.Password);
            if (result.Succeeded && registerForDto.Roles != null)
            {
                await _userManager.AddToRolesAsync(user, registerForDto.Roles);
            }
            return result;
        }
    }
}
