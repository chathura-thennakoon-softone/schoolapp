namespace SCH.Core.ErrorHandling
{
    using Microsoft.AspNetCore.Diagnostics;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Configuration;
    using SCH.Shared.Exceptions;
    using System.Net;

    public class AppExceptionHandler : IExceptionHandler
    {
        private readonly IConfiguration configuration;

        public AppExceptionHandler(IConfiguration configuration) 
        { 
            this.configuration = configuration; 
        }

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
        {
            AppErrorContent appErrorContent;
            HttpStatusCode statusCode;

            if (exception is SCHException sCHException)
            {

                appErrorContent = new AppErrorContent
                {
                    Message = sCHException.Message
                };


                SCHExceptionTypes expType = sCHException.SCHExceptionType;

                statusCode = HttpStatusCode.InternalServerError;
                if (sCHException is SCHDomainException)
                {
                    if (expType == SCHExceptionTypes.NotFound)
                    {
                        statusCode = HttpStatusCode.NotFound;
                    }
                    else if (expType == SCHExceptionTypes.BadRequest)
                    {
                        statusCode = HttpStatusCode.BadRequest;
                    }
                    else if (expType == SCHExceptionTypes.Forbidden)
                    {
                        statusCode = HttpStatusCode.Forbidden;
                    }
                    else if (expType == SCHExceptionTypes.Unauthorized)
                    {
                        statusCode = HttpStatusCode.Unauthorized;
                    }
                    else
                    {
                        statusCode = HttpStatusCode.Conflict;
                    }

                }
                else if (sCHException is SCHApplicationException)
                {
                    if (expType == SCHExceptionTypes.ServiceUnavailable)  
                    {
                        statusCode = HttpStatusCode.ServiceUnavailable;
                    }
                    else
                    {
                        statusCode = HttpStatusCode.InternalServerError;
                    }

                }

            }
            else
            {

                statusCode = HttpStatusCode.InternalServerError;

                string? defaultLogLevel = configuration["AppSettings:HideResponseErrors"];
                if (defaultLogLevel == true.ToString())
                {
                    const string criticalErrorMessage = "CRITICAL ERROR(S) OCCURRED";

                    appErrorContent = new AppErrorContent 
                    { 
                        Message = criticalErrorMessage 
                    };
                }
                else
                {
                    appErrorContent = new AppErrorContent
                    {
                        Message = exception.Message,
                        Trace = exception.ToString()
                    };
                }
            }

            httpContext.Response.StatusCode = ((int)statusCode);
            await httpContext.Response
                .WriteAsJsonAsync(appErrorContent);

            return true;
        }
    }
}
