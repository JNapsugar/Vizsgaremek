/*
using IngatlanokBackend.Controllers;
using IngatlanokBackend.DTOs;
using IngatlanokBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

public class FelhasznaloControllerTests
{
    private readonly Mock<IConfiguration> _mockConfig;
    private readonly Mock<IngatlanberlesiplatformContext> _mockContext;
    private readonly FelhasznaloController _controller;

    // Konstruktor: Inicializáljuk a mockokat és a controllert
    public FelhasznaloControllerTests()
    {
        _mockConfig = new Mock<IConfiguration>(); // Mock az alkalmazás konfigurációhoz
        _mockContext = new Mock<IngatlanberlesiplatformContext>(); // Mock az adatbázis-kontextushoz
        _controller = new FelhasznaloController(_mockConfig.Object, _mockContext.Object);
    }

    [Fact]
    public async Task Bejelentkezes_ShouldReturnUnauthorized_WhenUserNotFound()
    {
        // Arrange: Felkészülünk a teszt végrehajtására
        var loginDto = new LoginDTO { LoginName = "testuser", Password = "testpassword" };

        // Beállítjuk, hogy a mockolt adatbázis-konténer ne találjon felhasználót
        _mockContext.Setup(c => c.Felhasznaloks.FirstOrDefaultAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<Felhasznalok, bool>>>()))
            .ReturnsAsync((Felhasznalok)null);

        // Act: Meghívjuk a Login metódust
        var result = await _controller.Login(loginDto);

        // Assert: Ellenőrizzük, hogy a metódus "Unauthorized" eredményt ad
        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    [Fact]
    public async Task Regisztracio_ShouldReturnBadRequest_WhenUserAlreadyExists()
    {
        // Arrange: Felkészülünk egy olyan helyzetre, ahol a felhasználó már létezik
        var registrationDto = new RegistrationDTO
        {
            LoginName = "testuser",
            Email = "test@test.com",
            Password = "testpassword",
            Name = "Test User"
        };

        // Beállítjuk, hogy a mockolt adatbázis szerint a felhasználó vagy az email már foglalt
        _mockContext.Setup(c => c.Felhasznaloks.AnyAsync(f => f.LoginNev == registrationDto.LoginName || f.Email == registrationDto.Email))
            .ReturnsAsync(true);

        // Act: Meghívjuk a Register1 metódust
        var result = await _controller.Register1(registrationDto);

        // Assert: Ellenőrizzük, hogy "BadRequest" eredmény jön vissza
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task FelhasznaloLekerdezese_ShouldReturnNotFound_WhenUserDoesNotExist()
    {
        // Arrange: Egy nem létező felhasználó adatait kérjük le
        string loginNev = "nonexistentuser";

        // Beállítjuk, hogy a mockolt adatbázis ne találja a felhasználót
        _mockContext.Setup(c => c.Felhasznaloks.FirstOrDefaultAsync(u => u.LoginNev == loginNev))
            .ReturnsAsync((Felhasznalok)null);

        // Act: Meghívjuk a GetCurrentUser metódust
        var result = await _controller.GetCurrentUser(loginNev);

        // Assert: Ellenőrizzük, hogy "NotFound" eredmény jön vissza
        Assert.IsType<NotFoundObjectResult>(result);
    }
}
*/