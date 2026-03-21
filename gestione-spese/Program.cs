using Microsoft.EntityFrameworkCore;
using gestione_spese.Data;

var builder = WebApplication.CreateBuilder(args);

// Forza la visualizzazione degli errori dettagliati anche in produzione
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddHttpClient();

// === MODIFICA CHIAVE PER SQLITE SU AZURE ===
// Usa una cartella dove Azure garantisce i permessi di lettura/scrittura
var dbFolder = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
var dbPath = Path.Combine(dbFolder, "gestionespese.db");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));
// ==========================================

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

// Mostra la pagina di errore dettagliata se qualcosa va storto
app.UseDeveloperExceptionPage();

// Migrazione automatica del Database all'avvio
try
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<ApplicationDbContext>();
        context.Database.Migrate();
    }
}
catch (Exception ex)
{
    Console.WriteLine($"Errore durante la migrazione del DB: {ex.Message}");
    // Se fallisce, logghiamo ma lasciamo partire l'app per mostrare l'errore in Swagger
}

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Gestione Spese API v1"));

app.UseRouting();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
