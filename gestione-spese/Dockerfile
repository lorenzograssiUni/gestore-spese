# ── Build stage ──────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Usa solo la cartella NuGet interna al container (niente fallback Windows)
ENV NUGET_PACKAGES=/root/.nuget/packages

COPY gestione-spese.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o /app/publish --no-restore

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