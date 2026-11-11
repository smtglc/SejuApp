using AutoMapper;
using Domain.Dto;
using Domain.Dto.Request;
using Domain.Dto.Response;
using Domain.Models;

namespace SejuApi.Utilities
{
    public class MappingProfile :Profile
    {
        public MappingProfile()
        {
            CreateMap<UserRegisterForDto, User>();
            CreateMap<CreateDeckDto, Deck>();
            CreateMap<UpdateForDeckDto, Deck>();
            CreateMap<Deck, ResponseDeckDto>();


        }
    }
}
