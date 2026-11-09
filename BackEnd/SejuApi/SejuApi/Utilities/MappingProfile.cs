using AutoMapper;
using Domain.Dto;
using Domain.Models;

namespace SejuApi.Utilities
{
    public class MappingProfile :Profile
    {
        public MappingProfile()
        {
            CreateMap<UserRegisterForDto, User>();

        }
    }
}
