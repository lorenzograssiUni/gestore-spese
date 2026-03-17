using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gestione_spese.Migrations
{
    /// <inheritdoc />
    public partial class CreazioneIniziale : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Gruppi",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Descrizione = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    DataCreazione = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Attivo = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Gruppi", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Utenti",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: true),
                    Gruppo_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    DataIscrizione = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Utenti", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Utenti_Gruppi_Gruppo_ID",
                        column: x => x.Gruppo_ID,
                        principalTable: "Gruppi",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Riepiloghi",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Gruppo_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    ChiDeve_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    AChiDeve_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    Importo = table.Column<decimal>(type: "decimal(10, 2)", nullable: false),
                    DataCalcolo = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Pagato = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Riepiloghi", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Riepiloghi_Gruppi_Gruppo_ID",
                        column: x => x.Gruppo_ID,
                        principalTable: "Gruppi",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Riepiloghi_Utenti_AChiDeve_ID",
                        column: x => x.AChiDeve_ID,
                        principalTable: "Utenti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Riepiloghi_Utenti_ChiDeve_ID",
                        column: x => x.ChiDeve_ID,
                        principalTable: "Utenti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Spese",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Gruppo_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    ChiPaga_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    Importo = table.Column<decimal>(type: "decimal(10, 2)", nullable: false),
                    Descrizione = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    DataSpesa = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Categoria = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Spese", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Spese_Gruppi_Gruppo_ID",
                        column: x => x.Gruppo_ID,
                        principalTable: "Gruppi",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Spese_Utenti_ChiPaga_ID",
                        column: x => x.ChiPaga_ID,
                        principalTable: "Utenti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Divisioni",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Spesa_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    Utente_ID = table.Column<int>(type: "INTEGER", nullable: false),
                    Importo = table.Column<decimal>(type: "decimal(10, 2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Divisioni", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Divisioni_Spese_Spesa_ID",
                        column: x => x.Spesa_ID,
                        principalTable: "Spese",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Divisioni_Utenti_Utente_ID",
                        column: x => x.Utente_ID,
                        principalTable: "Utenti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Divisioni_Spesa_ID",
                table: "Divisioni",
                column: "Spesa_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Divisioni_Utente_ID",
                table: "Divisioni",
                column: "Utente_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Riepiloghi_AChiDeve_ID",
                table: "Riepiloghi",
                column: "AChiDeve_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Riepiloghi_ChiDeve_ID",
                table: "Riepiloghi",
                column: "ChiDeve_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Riepiloghi_Gruppo_ID",
                table: "Riepiloghi",
                column: "Gruppo_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Spese_ChiPaga_ID",
                table: "Spese",
                column: "ChiPaga_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Spese_Gruppo_ID",
                table: "Spese",
                column: "Gruppo_ID");

            migrationBuilder.CreateIndex(
                name: "IX_Utenti_Gruppo_ID",
                table: "Utenti",
                column: "Gruppo_ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Divisioni");

            migrationBuilder.DropTable(
                name: "Riepiloghi");

            migrationBuilder.DropTable(
                name: "Spese");

            migrationBuilder.DropTable(
                name: "Utenti");

            migrationBuilder.DropTable(
                name: "Gruppi");
        }
    }
}
