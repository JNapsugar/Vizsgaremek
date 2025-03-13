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
        private readonly HttpClient _httpClient = new HttpClient();

        public static bool isLoggedIn = false;
        private static List<string> endpoints = new List<string>()
        {
            "Felhasznalo/allUsers",
            "ingatlan/ingatlanok",
            "Foglalasok/user",
        };

        public static string path = string.Empty;
        public MainWindow()
        {
            Login login = new Login();
            login.ShowDialog();
            if (!isLoggedIn)
            {
                this.Close();
            }

            InitializeComponent();

            endpointsList.ItemsSource = endpoints;
        }

        private void endpointsList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (endpointsList.SelectedIndex > -1)
            {
                path = endpointsList.SelectedItem.ToString();
            }
        }

        // FELHASZNALOK
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

        // FELHASZNALOK

        // INGATLANOK
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
        // INGATLANOK

        //CRUD KÉRÉSEK kezdete a Felhasznalok, Ingatlanok és a Foglalasok táblához
        private async void GET_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (string.IsNullOrEmpty(path))
                {
                    MessageBox.Show("Kérlek, válassz egy végpontot!", "Figyelmeztetés", MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                string url = $"https://localhost:7079/api/{path}";

                HttpResponseMessage response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                string responseContent = await response.Content.ReadAsStringAsync();

                if (path == "ingatlan/ingatlanok")
                {
                    dtg.ItemsSource = JsonSerializer.Deserialize<List<Ingatlanok>>(responseContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                }
                else if (path == "Felhasznalo/allUsers")
                {
                    dtg.ItemsSource = JsonSerializer.Deserialize<List<Felhasznalok>>(responseContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                }
                else
                {
                    MessageBox.Show("Ismeretlen végpont!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                }

                if (endpointsList.SelectedIndex == -1 && endpointsList.Items.Count > 0)
                {
                    endpointsList.SelectedIndex = 0;
                    path = endpointsList.SelectedItem.ToString();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba történt: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private async void POST_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (string.IsNullOrEmpty(path))
                {
                    MessageBox.Show("Kérlek, válassz egy végpontot!", "Figyelmeztetés", MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                string url = $"https://localhost:7079/api/{path}";

                if (path == "ingatlan/ingatlanok")
                {
                    var felvitelAblak = new FelvitelAblak(path);
                    if (felvitelAblak.ShowDialog() == true)
                    {
                        Ingatlanok ujIngatlan = felvitelAblak.UjIngatlan;

                        string json = JsonSerializer.Serialize(ujIngatlan);
                        StringContent content = new StringContent(json, Encoding.UTF8, "application/json");

                        HttpResponseMessage postResponse = await _httpClient.PostAsync(url, content);
                        postResponse.EnsureSuccessStatusCode();

                        MessageBox.Show("Sikeres ingatlan mentés!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                        GET_Click(sender, e);
                    }
                }
                else if (path == "Felhasznalo/addUser")
                {
                    var felhasznaloAblak = new FelhasznaloFelvitelAblak();
                    felhasznaloAblak.FelhasznaloHozzaadva += () => GET_Click(sender, e);

                    if (felhasznaloAblak.ShowDialog() == true)
                    {
                        FelhasznaloDTO ujFelhasznalo = felhasznaloAblak.UjFelhasznalo;

                        string json = JsonSerializer.Serialize(ujFelhasznalo);
                        StringContent content = new StringContent(json, Encoding.UTF8, "application/json");

                        HttpResponseMessage postResponse = await _httpClient.PostAsync(url, content);
                        postResponse.EnsureSuccessStatusCode();

                        MessageBox.Show("Sikeres felhasználó mentés!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                        GET_Click(sender, e);
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

        private async void DELETE_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (string.IsNullOrEmpty(path))
                {
                    MessageBox.Show("Kérlek, válassz egy végpontot!", "Figyelmeztetés", MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                // Ha a kiválasztott típus "Felhasznalo", akkor a törlés a loginName alapján történik
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

                    // Az URL, amely a felhasználó törléséhez szükséges, a loginName-t használja
                    string url = $"https://localhost:7079/api/Felhasznalo/delete/{selectedFelhasznalo.loginNev}";
                    HttpResponseMessage response = await _httpClient.DeleteAsync(url);
                    response.EnsureSuccessStatusCode();

                    // Ha sikerült a törlés, frissítjük az adatokat
                    MessageBox.Show("Sikeres törlés!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                    GET_Click(sender, e);
                }
                // Ha a kiválasztott típus "Ingatlan", akkor az ingatlan törlésére kerül sor
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

                    // Az URL, amely az ingatlan törléséhez szükséges, az ingatlan ID-t használja
                    string url = $"https://localhost:7079/api/ingatlan/ingatlanok/{selectedIngatlan.IngatlanId}";
                    HttpResponseMessage response = await _httpClient.DeleteAsync(url);
                    response.EnsureSuccessStatusCode();

                    // Ha sikerült a törlés, frissítjük az adatokat
                    MessageBox.Show("Sikeres törlés!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                    GET_Click(sender, e);
                }
                else
                {
                    MessageBox.Show("Kérlek, válassz egy felhasználót vagy ingatlant a törléshez!", "Figyelmeztetés", MessageBoxButton.OK, MessageBoxImage.Warning);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba történt: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void PUT_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (string.IsNullOrEmpty(path))
                {
                    MessageBox.Show("Kérlek, válassz egy végpontot!", "Figyelmeztetés", MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                // Ha egy ingatlan van kiválasztva
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

                // Ha egy felhasználó van kiválasztva
                if (dtg.SelectedItem is Felhasznalok selectedUser && selectedUser.id > 0)
                {
                    if (selectedUser.id <= 0)
                    {
                        MessageBox.Show("Érvénytelen felhasználó azonosító!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                        return;
                    }

                    var modositFelhasznaloAblak = new FelhasznaloModositAblak(selectedUser.id);
                    modositFelhasznaloAblak.ShowDialog();
                    GET_Click(sender, e);
                    return;
                }

                MessageBox.Show("Kérlek, válassz ki egy felhasználót vagy ingatlant a listából!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba történt: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

    }
        //CRUD KÉRÉSEK vége a Felhasznalok, Ingatlanok és a Foglalasok táblához
}