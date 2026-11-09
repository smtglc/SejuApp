using Infrastructure.Seeds; 
namespace SejuApi.Extensions
{
    public static class SeedExtensions
    {
        public static async Task SeedIdentityAsync(this IServiceProvider services)
        {
            using var scope = services.CreateScope();
            await IdentitySeeder.SeedAsync(scope.ServiceProvider);
        }
    }
}
