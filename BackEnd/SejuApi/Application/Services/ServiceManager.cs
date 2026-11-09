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

namespace Application.Services
{
    public class ServiceManager : IServiceManager
    {
        private readonly Lazy<IAuthenticationService> _authenticationService;   
        public ServiceManager(IAuthenticationService service,ILoggerService logger ,IMapper mapper,UserManager<User> user, IConfiguration configuration)
        {
            _authenticationService = new Lazy<IAuthenticationService>(() => new AuthenticationManager(logger, mapper, user, configuration));
        }
        public IAuthenticationService AuthenticationService => _authenticationService.Value;
    }
}
