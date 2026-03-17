using Microsoft.EntityFrameworkCore;
using gestione_spese.Data;

var builder = WebApplication.CreateBuilder(args);

// Aggiungi servizi al contenitore e imposta le opzioni JSON in una sola passata
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        // Questo dice al sistema: "Se vedi un ciclo infinito (es. Gruppo->Spese->Gruppo), ignoralo e fermati"
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddHttpClient();

// 1. REGISTRA IL DBCONTEXT (Database fisico SQLite)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. CONFIGURA SWAGGER
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 3. CONFIGURA CORS (Per permettere a React di fare chiamate al backend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();
// --- AGGIUNTA: CREA LE TABELLE SE NON ESISTONO ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ApplicationDbContext>();
    context.Database.Migrate(); // Applica tutte le migrazioni e crea le tabelle!
}
// -------------------------------------------------

// Configura la pipeline delle richieste HTTP.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios.
    app.UseHsts();
}

// ABILITA SWAGGER
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Gestione Spese API v1");
});

app.UseHttpsRedirection();
app.UseRouting();

app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapStaticAssets();

// Rotta predefinita per l'app MVC (es. Home, View)
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

// Mappa i controller API (come il GruppoController)
app.MapControllers();

app.Run();
