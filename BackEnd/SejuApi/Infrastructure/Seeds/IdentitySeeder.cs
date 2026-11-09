using Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Seeds
{
    public static class IdentitySeeder
    {
        public static async Task SeedAsync(IServiceProvider services)
        {
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = services.GetRequiredService<UserManager<User>>();
            var config = services.GetRequiredService<IConfiguration>();

            // 1. Rolleri oluştur
            foreach (var role in new[] { "Admin", "User" })
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }

            // 2. Admin bilgilerini ayarlardan oku
            var adminUserName = config["SeedAdmin:UserName"];
            var adminPassword = config["SeedAdmin:Password"];

            // Ayar yoksa admin oluşturma
            if (string.IsNullOrWhiteSpace(adminUserName) || string.IsNullOrWhiteSpace(adminPassword))
                return;

            // 3. Admin yoksa oluştur
            var admin = await userManager.FindByNameAsync(adminUserName);
            if (admin == null)
            {
                admin = new User {
                    UserName = adminUserName,
                    Email = config["SeedAdmin:Email"] ?? "admin@seju.local",
                    EmailConfirmed = true,
                    FirstName = "Admin",
                    LastName = "Admin"
                };

                var result = await userManager.CreateAsync(admin, adminPassword);

                if (!result.Succeeded)
                {
                    Console.WriteLine("Admin oluşturulamadı: " +
                        string.Join(", ", result.Errors.Select(e => e.Description)));
                    return;
                }
            }

            // 4. Admin rolünde değilse ekle
            if (!await userManager.IsInRoleAsync(admin, "Admin"))
                await userManager.AddToRoleAsync(admin, "Admin");
        }
    }
}
