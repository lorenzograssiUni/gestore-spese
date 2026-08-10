# ── Build stage ──────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Usa solo la cartella NuGet interna al container
ENV NUGET_PACKAGES=/root/.nuget/packages

# Copia csproj e NuGet.Config prima del restore
COPY gestione-spese.csproj NuGet.Config ./

# Usa la config locale, ignorando quella globale di Visual Studio
RUN dotnet restore gestione-spese.csproj --configfile NuGet.Config

# Copia tutto il resto del codice
COPY . ./

# Usa ancora la stessa config per la publish
RUN dotnet publish gestione-spese.csproj -c Release -o /app/publish --no-restore --configfile NuGet.Config

# ── Runtime stage ─────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

# Cartella persistente per il file SQLite
VOLUME ["/app/data"]

ENV ASPNETCORE_URLS=http://+:5207
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 5207
ENTRYPOINT ["dotnet", "gestione-spese.dll"]
