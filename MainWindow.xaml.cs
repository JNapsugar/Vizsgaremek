using System.Data;
using System.Net.Http;
using System.Security.Policy;
using System.Text;
using System.Text.Json;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using WpfLoginApp;
using static IngatlanKarbantartoWPF.MainWindow;
using static WpfLoginApp.Login;

namespace IngatlanKarbantartoWPF
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private readonly HttpClient _httpClient = new HttpClient();  // HTTP kliens az API hívásokhoz

        public static bool isLoggedIn = false; // Statikus változó, amely jelzi, hogy a felhasználó be van-e jelentkezve
        
        private static List<string> endpoints = new List<string>() // Az API végpontok listája, amelyeket az alkalmazás kezel
        {
            "Felhasznalo/allUsers",     // Felhasználók lekérése
            "ingatlan/ingatlanok",      // Ingatlanok lekérése
            "Foglalasok/allBookings",   // Foglalások lekérése
        };

        public static string path = string.Empty;  // Az aktuális végpont, amelyet az alkalmazás használ

        public MainWindow()
        {
            // Bejelentkezési ablak megjelenítése
            Login login = new Login(); 
            login.ShowDialog();

            if (!isLoggedIn) // Ha a felhasználó nem jelentkezett be, akkor bezárjuk az alkalmazást
            {
                this.Close();
            }

            InitializeComponent();  // Alkalmazás inicializálása
            
            endpointsList.ItemsSource = endpoints; // Végpontok listájának megjelenítése
        }

        // Az endpointok közötti választás kezelése
        private void endpointsList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (endpointsList.SelectedIndex > -1)
            {
                path = endpointsList.SelectedItem.ToString();  // Az aktuális választott végpont beállítása
            }
        }

        // Felhasználók osztálya
        public class Felhasznalok
        {
            public int id { get; set; }
            public string loginNev { get; set; } = null!;
            public string name { get; set; } = null!;
            public int? permissionId { get; set; }
            public bool active { get; set; }
            public string email { get; set; } = null!;
            public string profilePicturePath { get; set; } = null!;
        }

        // Ingatlanok osztálya
        public class Ingatlanok
        {
            public int IngatlanId { get; set; }
            public int TulajdonosId { get; set; }
            public string Cim { get; set; } = null!;
            public string? Leiras { get; set; }
            public string? Helyszin { get; set; }
            public decimal Ar { get; set; }
            public int Meret { get; set; }
            public string Szolgaltatasok { get; set; }
            public int Szoba { get; set; }
            public DateTime FeltoltesDatum { get; set; }
        }

        // Foglalások osztálya
        public class Foglalasok
        {
            public int FoglalasId { get; set; }
            public int IngatlanId { get; set; }
            public int BerloId { get; set; }
            public DateTime KezdesDatum { get; set; }
            public DateTime BefejezesDatum { get; set; }
            public string? Allapot { get; set; }
            public DateTime LetrehozasDatum { get; set; }
        }

        // GET kérés a különböző végpontokra
        private async void GET_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                // Ha nincs kiválasztott végpont, figyelmeztető üzenet
                if (string.IsNullOrEmpty(path))
                {
                    MessageBox.Show("Kérlek, válassz egy végpontot!", "Figyelmeztetés", MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                string url = $"https://localhost:7079/api/{path}";  // Az aktuális API végpont URL-je

                // API hívás a GET metódussal
                HttpResponseMessage response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();  // Ellenőrzi a válasz státuszát

                string responseContent = await response.Content.ReadAsStringAsync();  // A válasz tartalmának lekérése

                // JSON válasz deszerializálása és az adatok megjelenítése
                if (path == "ingatlan/ingatlanok")
                {
                    dtg.ItemsSource = JsonSerializer.Deserialize<List<Ingatlanok>>(responseContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                }
                else if (path == "Felhasznalo/allUsers")
                {
                    dtg.ItemsSource = JsonSerializer.Deserialize<List<Felhasznalok>>(responseContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                }
                else if (path == "Foglalasok/allBookings")
                {
                    dtg.ItemsSource = JsonSerializer.Deserialize<List<Foglalasok>>(responseContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                }
                else
                {
                    MessageBox.Show("Ismeretlen végpont!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                }

                // Ha nem volt végpont kiválasztva, akkor automatikusan az elsőt válassza
                if (endpointsList.SelectedIndex == -1 && endpointsList.Items.Count > 0)
                {
                    endpointsList.SelectedIndex = 0;
                    path = endpointsList.SelectedItem.ToString();
                }
            }
            catch (Exception ex)
            {
                // Hibaüzenet megjelenítése, ha a hívás nem sikerült
                MessageBox.Show($"Hiba történt: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // POST kérés az új adatok hozzáadásához
        private async void POST_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                // Ha nincs kiválasztott végpont, figyelmeztető üzenet
                if (string.IsNullOrEmpty(path))
                {
                    MessageBox.Show("Kérlek, válassz egy végpontot!", "Figyelmeztetés", MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                string requestUrl = $"https://localhost:7079/api/{path}";  // Az API végpont URL-je

                // A kiválasztott végpont alapján új adatokat adunk hozzá
                // Ingatlan hozzáadása
                if (path == "ingatlan/ingatlanok")
                {
                    var felvitelAblak = new FelvitelAblak(path);
                    if (felvitelAblak.ShowDialog() == true)
                    {
                        Ingatlanok ujIngatlan = felvitelAblak.UjIngatlan;  // Az új ingatlan adatainak lekérése

                        string json = JsonSerializer.Serialize(ujIngatlan);  // Az új ingatlan adatainak JSON formátumra konvertálása
                        StringContent content = new StringContent(json, Encoding.UTF8, "application/json");

                        // POST kérés küldése
                        HttpResponseMessage postResponse = await _httpClient.PostAsync(requestUrl, content);
                        postResponse.EnsureSuccessStatusCode();  // A válasz ellenőrzése

                        MessageBox.Show("Sikeres ingatlan mentés!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                        GET_Click(sender, e);  // Az adatok frissítése
                    }
                }
                // Felhasználó hozzáadása
                else if (path == "Felhasznalo/allUsers")
                {
                    var felhasznaloAblak = new FelhasznaloFelvitelAblak(path);
                    if (felhasznaloAblak.ShowDialog() == true)
                    {
                        FelhasznaloDTO ujFelhasznalo = felhasznaloAblak.UjFelhasznalo;

                        string json = JsonSerializer.Serialize(ujFelhasznalo);
                        StringContent content = new StringContent(json, Encoding.UTF8, "application/json");

                        try
                        {
                            HttpResponseMessage postResponse = await _httpClient.PostAsync(requestUrl, content);

                            if (postResponse.IsSuccessStatusCode)
                            {
                                MessageBox.Show("Sikeres felhasználó mentés!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                                GET_Click(sender, e);  // Az adatok frissítés
                            }
                            else
                            {
                                MessageBox.Show($"Hiba történt: {postResponse.StatusCode}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                            }
                        }
                        catch (Exception ex)
                        {
                            MessageBox.Show($"Hiba történt: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                        }
                    }
                }
                // Foglalás hozzáadása
                else if (path == "Foglalasok/allBookings")
                {
                    var foglalasAblak = new FoglalasFelvitelAblak(path);
                    if (foglalasAblak.ShowDialog() == true)
                    {
                        FoglalasDTO ujFoglalas = foglalasAblak.ujFoglalas;

                        if (ujFoglalas == null)
                        {
                            MessageBox.Show("A foglalás adatai nem megfelelőek!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                            return;
                        }

                        string json = JsonSerializer.Serialize(ujFoglalas);
                        MessageBox.Show($"Foglalás adatai JSON-ben: {json}", "Debug", MessageBoxButton.OK, MessageBoxImage.Information);

                        StringContent content = new StringContent(json, Encoding.UTF8, "application/json");

                        try
                        {
                            HttpResponseMessage postResponse = await _httpClient.PostAsync(requestUrl, content);

                            if (postResponse.IsSuccessStatusCode)
                            {
                                MessageBox.Show("Sikeres foglalás mentés!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                                GET_Click(sender, e);  // Az adatok frissítés
                            }
                            else
                            {
                                MessageBox.Show($"Hiba történt: {postResponse.StatusCode}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                            }
                        }
                        catch (Exception ex)
                        {
                            MessageBox.Show($"Hiba történt: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                        }
                    }
                }
                else
                {
                    MessageBox.Show("Ismeretlen végpont!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba történt: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // DELETE kérés a kiválasztott elem törlésére
        private async void DELETE_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (string.IsNullOrEmpty(path))
                {
                    MessageBox.Show("Kérlek, válassz egy végpontot!", "Figyelmeztetés", MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                // A kiválasztott elem törlésére vonatkozó kód
                // Felhasználó loginNev alapján kerül törlésre
                if (dtg.SelectedItem is Felhasznalok selectedFelhasznalo)
                {
                    MessageBoxResult result = MessageBox.Show(
                        $"Biztosan törölni akarod a felhasználót: {selectedFelhasznalo.loginNev}?",
                        "Megerősítés",
                        MessageBoxButton.YesNo,
                        MessageBoxImage.Question);

                    if (result == MessageBoxResult.No)
                    {
                        return;
                    }

                    string url = $"https://localhost:7079/api/Felhasznalo/delete/{selectedFelhasznalo.loginNev}";
                    HttpResponseMessage response = await _httpClient.DeleteAsync(url);
                    response.EnsureSuccessStatusCode();

                    MessageBox.Show("Sikeres törlés!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                    GET_Click(sender, e);
                }
                // Az ingatlan cím alapján kerül törlésre
                else if (dtg.SelectedItem is Ingatlanok selectedIngatlan)
                {
                    MessageBoxResult result = MessageBox.Show(
                        $"Biztosan törölni akarod az ingatlant: {selectedIngatlan.Cim}?",
                        "Megerősítés",
                        MessageBoxButton.YesNo,
                        MessageBoxImage.Question);

                    if (result == MessageBoxResult.No)
                    {
                        return;
                    }

                    string url = $"https://localhost:7079/api/ingatlan/ingatlanok/{selectedIngatlan.IngatlanId}";
                    HttpResponseMessage response = await _httpClient.DeleteAsync(url);
                    response.EnsureSuccessStatusCode();

                    MessageBox.Show("Sikeres törlés!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                    GET_Click(sender, e);
                }
                // Ellenőrizd, hogy van-e kiválasztott elem és a megfelelő típus
                else if (dtg.SelectedItem is Foglalasok selectedFoglalas)
                {
                    MessageBoxResult result = MessageBox.Show(
                        $"Biztosan törölni akarod ezt a foglalást (ID: {selectedFoglalas.FoglalasId})?",
                        "Megerősítés",
                        MessageBoxButton.YesNo,
                        MessageBoxImage.Question);

                    if (result == MessageBoxResult.No)
                    {
                        return;
                    }

                    // Törlés URL beállítása
                    string url = $"https://localhost:7079/api/Foglalasok/{selectedFoglalas.FoglalasId}";

                    // API hívás a törléshez
                    try
                    {
                        HttpResponseMessage response = await _httpClient.DeleteAsync(url);
                        response.EnsureSuccessStatusCode();  // Ha nem sikerült a kérés, kiváltja az exception-t

                        MessageBox.Show("Sikeres foglalás törlés!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                        GET_Click(sender, e);  // Frissíti az adatokat a törlés után
                    }
                    catch (Exception ex)
                    {
                        // Ha hiba történt a törlésnél
                        MessageBox.Show($"Hiba történt a törlés során: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                    }
                }
                else
                {
                    // Ha nincs kiválasztott elem vagy nem a megfelelő típusú elem
                    MessageBox.Show("Kérlek, válassz egy elemet a törléshez (Felhasználó, Ingatlan vagy Foglalás)!", "Figyelmeztetés", MessageBoxButton.OK, MessageBoxImage.Warning);
                }
            }
            catch (Exception ex)
            {
                // Hibaüzenet a törlés során fellépő hibákra
                MessageBox.Show($"Hiba történt: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // PUT kérés az adatok frissítéséhez
        private void PUT_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (string.IsNullOrEmpty(path))
                {
                    MessageBox.Show("Kérlek, válassz egy végpontot!", "Figyelmeztetés", MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                // Ingatlan módosítása
                if (dtg.SelectedItem is Ingatlanok selectedIngatlan && selectedIngatlan.IngatlanId > 0)
                {
                    if (selectedIngatlan.IngatlanId < 0)
                    {
                        MessageBox.Show("Érvénytelen ingatlan azonosító!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                        return;
                    }

                    var modositAblak = new ModositAblak(selectedIngatlan.IngatlanId, path);
                    modositAblak.ShowDialog();
                    GET_Click(sender, e);
                    return;
                }

                // Felhasználó módosítása
                if (dtg.SelectedItem is Felhasznalok selectedUser && selectedUser.id > 0)
                {
                    if (selectedUser.id <= 0)
                    {
                        MessageBox.Show("Érvénytelen felhasználó azonosító!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                        return;
                    }

                    var felhasznaloModositAblak = new FelhasznaloModositAblak(selectedUser.id);
                    felhasznaloModositAblak.ShowDialog();
                    GET_Click(sender, e);
                }

                // Foglalás módosítása
                if (dtg.SelectedItem is Foglalasok selectedFoglalas && selectedFoglalas.FoglalasId > 0)
                {
                    if (selectedFoglalas.FoglalasId <= 0)
                    {
                        MessageBox.Show("Érvénytelen foglalás azonosító!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                        return;
                    }

                    // A foglalás módosító ablak megnyitása
                    var foglalasModositAblak = new FoglalasModositAblak(selectedFoglalas.FoglalasId);
                    foglalasModositAblak.ShowDialog();
                    GET_Click(sender, e);
                    return;
                }

                else
                {
                    // Ha nincs kiválasztott elem
                    MessageBox.Show("Kérlek, válassz ki egy frissíteni kívánt elemet!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            catch (Exception ex)
            {
                // Hiba üzenet
                MessageBox.Show($"Hiba történt: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }
}