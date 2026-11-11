using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Dto.Request
{
    public record UpdateForDeckDto
    {
        public string Name { get; init; }
        public string Description { get; init; }
    }
}
