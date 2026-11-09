using AutoMapper;
using AutoMapper.Configuration;
using Domain.Dto;
using Domain.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contract
{
    public interface IAuthenticationService
    {
       Task<IdentityResult> RegisterUserAsync(UserRegisterForDto registerForDto);
    }
}
