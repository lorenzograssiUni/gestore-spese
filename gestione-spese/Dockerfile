# ── Build stage ──────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

ENV NUGET_PACKAGES=/root/.nuget/packages

# Copia csproj e NuGet.Config prima del restore
COPY gestione-spese.csproj NuGet.Config ./

# Restore usando SOLO la config locale
RUN dotnet restore gestione-spese.csproj --configfile NuGet.Config

# Copia tutto il resto del codice
COPY . ./

# Workaround: rimuovi qualsiasi riferimento alla fallback folder di Visual Studio
RUN sed -i 's#C\\\\Program Files (x86)\\\\Microsoft Visual Studio\\\\Shared\\\\NuGetPackages##g' NuGet.Config

# Publish usando ancora SOLO la config locale
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
