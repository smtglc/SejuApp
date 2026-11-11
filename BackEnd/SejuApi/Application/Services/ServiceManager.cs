using Application.Contract;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Domain.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Infrastructure.Contracts;

namespace Application.Services
{
    public class ServiceManager : IServiceManager
    {
        private readonly Lazy<IAuthenticationService> _authenticationService;
        private readonly Lazy<IDeckService> _deckService;
        public ServiceManager(IRepositoryManager repositoryManager ,IAuthenticationService service,ILoggerService logger ,IMapper mapper,UserManager<User> user, IConfiguration configuration)
        {
            _authenticationService = new Lazy<IAuthenticationService>(() => new AuthenticationManager(logger, mapper, user, configuration));
            _deckService = new Lazy<IDeckService>(() => new DeckService(repositoryManager, mapper));
        }
        public IAuthenticationService AuthenticationService => _authenticationService.Value;

        public IDeckService DeckService => _deckService.Value;
    }
}
