using Microsoft.EntityFrameworkCore;
using gestione_spese.Data; 

var builder = WebApplication.CreateBuilder(args);

// Aggiungi servizi al contenitore.
builder.Services.AddControllersWithViews(); // Mantiene il supporto per MVC (Views)
builder.Services.AddControllers(); // Supporto esplicito per le API REST

// 1. REGISTRA IL DBCONTEXT (Database In-Memory per il progetto)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("GestioneSpeseDb"));

// 2. CONFIGURA SWAGGER
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configura la pipeline delle richieste HTTP.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
else
{
    // 3. ABILITA SWAGGER IN SVILUPPO
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Gestione Spese API v1");
    });
}

app.UseHttpsRedirection();
app.UseRouting();

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
