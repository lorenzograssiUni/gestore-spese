using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gestione_spese.Migrations
{
    /// <inheritdoc />
    public partial class AggiuntaPasswordHash : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Utenti",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Utenti");
        }
    }
}
