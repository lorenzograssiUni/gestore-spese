using Microsoft.EntityFrameworkCore;
using gestione_spese.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddHttpClient();

// ✅ Percorso persistente su Azure App Service (C:\home)
var dbPath = Path.Combine("C:\\home", "gestionespese.db");

builder.Services.AddDbContext<gestione_spese.Data.ApplicationDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

builder.Services.AddEndpointsApiExplorer();

// ✅ Swagger senza OpenApiInfo (evita il problema del pacchetto mancante)
builder.Services.AddSwaggerGen(c =>
{
    c.CustomSchemaIds(type => type.FullName);
    c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// ✅ Crea le tabelle se non esistono
try
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider
            .GetRequiredService<gestione_spese.Data.ApplicationDbContext>();
        context.Database.EnsureCreated();
    }
}
catch (Exception ex)
{
    File.AppendAllText("C:\\home\\startup-log.txt",
        $"[{DateTime.Now}] DB ERROR: {ex.Message}\n");
}

app.UseDeveloperExceptionPage();

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Gestione Spese API v1"));

app.UseRouting();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();