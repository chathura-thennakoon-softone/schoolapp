using SCH.Core.Cors;
using SCH.Core.DependancyConfiguration;
using SCH.Core.ErrorHandling;

var builder = WebApplication.CreateBuilder(args);

const string allowOriginsPolicy = "AllowOrigins";

builder.Services.AddAllowedOrigins(
    allowOriginsPolicy, builder.Configuration.GetSection("AllowedOrigins").Value);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddServices();
builder.Services.AddRepositories();
builder.Services.AddDbContexts(builder.Configuration.GetConnectionString("DefaultConnection"));
builder.Services.AddUnitOfWorks();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddExceptionHandler<AppExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "SCH.Api v1");
        options.RoutePrefix = string.Empty; // Set Swagger UI as the default page
    });
}

app.UseHttpsRedirection();

app.UseExceptionHandler();

app.UseCors(allowOriginsPolicy);

app.UseAuthorization();

app.MapControllers();

await app.RunAsync();
