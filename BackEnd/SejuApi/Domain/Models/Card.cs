using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Card
    {
        public Guid Id { get; set; }
        public string Word { get; set; }
        public string Meaning { get; set; }
        public Guid DeckId { get; set; }   // Foreign key
        public Deck Deck { get; set; }
    }
}
