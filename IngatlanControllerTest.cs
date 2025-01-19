using IngatlanokBackend.Controllers;
using IngatlanokBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

public class IngatlanControllerTests
{
    private readonly Mock<IngatlanberlesiplatformContext> _mockContext;
    private readonly IngatlanController _controller;

    // Konstruktor: inicializáljuk a mock-okat és a controllert
    public IngatlanControllerTests()
    {
        _mockContext = new Mock<IngatlanberlesiplatformContext>();
        _controller = new IngatlanController();
    }

    [Fact]
    public async Task OsszesIngatlanLekerese_Sikeres()
    {
        // Arrange: Mockoljuk az adatbázist egy teszt adatsorral
        var tesztAdatok = new List<Ingatlanok>
        {
            new Ingatlanok { IngatlanId = 1, Cim = "Budapest, Fő utca 1.", Meret = 50 },
            new Ingatlanok { IngatlanId = 2, Cim = "Szeged, Tisza utca 2.", Meret = 75 }
        };

        var dbSetMock = new Mock<DbSet<Ingatlanok>>();
        dbSetMock.Setup(m => m.ToListAsync()).ReturnsAsync(tesztAdatok);

        _mockContext.Setup(c => c.Ingatlanoks).Returns(dbSetMock.Object);

        // Act: Meghívjuk a Get metódust
        var result = await _controller.Get();

        // Assert: Ellenőrizzük, hogy a válasz helyes és tartalmazza a teszt adatokat
        var okResult = Assert.IsType<OkObjectResult>(result);
        var visszaadottAdatok = Assert.IsType<List<Ingatlanok>>(okResult.Value);
        Assert.Equal(2, visszaadottAdatok.Count);
    }

    [Fact]
    public async Task IngatlanLekereseIdAlapjan_Sikeres()
    {
        // Arrange: Egy adott ingatlant mockolunk
        var tesztIngatlan = new Ingatlanok { IngatlanId = 1, Cim = "Budapest, Fő utca 1.", Meret = 50 };

        var dbSetMock = new Mock<DbSet<Ingatlanok>>();
        dbSetMock.Setup(m => m.FirstOrDefaultAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<Ingatlanok, bool>>>()))
                 .ReturnsAsync(tesztIngatlan);

        _mockContext.Setup(c => c.Ingatlanoks).Returns(dbSetMock.Object);

        // Act: Meghívjuk a GetById metódust
        var result = await _controller.Get(tesztIngatlan.IngatlanId);

        // Assert: Ellenőrizzük, hogy a válasz tartalmazza a helyes ingatlant
        var okResult = Assert.IsType<OkObjectResult>(result);
        var visszaadottIngatlan = Assert.IsType<Ingatlanok>(okResult.Value);
        Assert.Equal(tesztIngatlan.Cim, visszaadottIngatlan.Cim);
    }

    [Fact]
    public async Task IngatlanTorlese_Sikeres()
    {
        // Arrange: Egy létező ingatlant törlünk
        var tesztIngatlanId = 1;

        var dbSetMock = new Mock<DbSet<Ingatlanok>>();
        _mockContext.Setup(c => c.Ingatlanoks).Returns(dbSetMock.Object);

        // Act: Meghívjuk a Delete metódust
        var result = await _controller.Delete(tesztIngatlanId);

        // Assert: Ellenőrizzük, hogy a válasz sikeres
        Assert.IsType<OkObjectResult>(result);
    }
}