using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Contracts
{
    public interface IRepositoryManager
    {
        IDeckRepository Deck { get; }
        ICardRepository Card { get; }
        Task SaveAsync();
    }  
}
