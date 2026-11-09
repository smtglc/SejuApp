using Application.Contract;
using Domain.Models;
using Microsoft.AspNetCore.Diagnostics;
using System.Net;

namespace SejuApi.Extensions
{
    public static class ExceptionMiddleWareExtension
    {
        public static void ConfigureExceptionHandler(this WebApplication app,
         ILoggerService logger)
        {
            app.UseExceptionHandler(appError =>
            {
                appError.Run(async context =>
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.ContentType = "application/json";

                    var contextFature = context.Features.Get<IExceptionHandlerFeature>();
                    if (contextFature != null)
                    {
                        logger.LogError($"Something went wrong: {contextFature.Error}");
                        await context.Response.WriteAsync(new ErrorDetails()
                        {
                            StatusCode = context.Response.StatusCode,
                            Message = "Internal Server Error. Please try again later."
                        }.ToString());
                    }
                });

            });
        }
    }
}
