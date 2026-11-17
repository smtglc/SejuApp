using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Dto.Request
{
    public record CreateCardDto
    {
        public string Word { get; init; }
        public string Meaning { get; init; }
    }
}
