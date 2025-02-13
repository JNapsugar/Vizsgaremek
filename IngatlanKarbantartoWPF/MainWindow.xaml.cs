using System.Net.Http;
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
        private static List<string> endpoints = new List<string>() { "ingatlan/ingatlanok" };
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

        // INGATLANOK CRUD kérésének kezdete
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
                var ingatlanok = JsonSerializer.Deserialize<List<Ingatlanok>>(responseContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                dtg.ItemsSource = ingatlanok;
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
                HttpResponseMessage response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                string responseContent = await response.Content.ReadAsStringAsync();
                var ingatlanLista = JsonSerializer.Deserialize<List<Ingatlanok>>(responseContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                var felvitelAblak = new FelvitelAblak(path);
                if (felvitelAblak.ShowDialog() == true)
                {
                    IngatlanDTO ujIngatlan = felvitelAblak.UjIngatlan;

                    string json = JsonSerializer.Serialize(ujIngatlan);
                    StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
                    HttpResponseMessage postResponse = await _httpClient.PostAsync(url, content);
                    postResponse.EnsureSuccessStatusCode();

                    MessageBox.Show("Sikeres mentés!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);

                    GET_Click(sender, e);
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

                if (dtg.SelectedItem is Ingatlanok selectedIngatlan)
                {
                    MessageBoxResult result = MessageBox.Show(
                        "Biztosan törölni akarod ezt az adatot?",
                        "Megerősítés",
                        MessageBoxButton.YesNo,
                        MessageBoxImage.Question);

                    if (result == MessageBoxResult.No)
                    {
                        return;
                    }

                    string url = $"https://localhost:7079/api/{path}/{selectedIngatlan.IngatlanId}";
                    HttpResponseMessage response = await _httpClient.DeleteAsync(url);
                    response.EnsureSuccessStatusCode();

                    MessageBox.Show("Sikeres törlés!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);

                    GET_Click(sender, e);
                }
                else
                {
                    MessageBox.Show("Kérlek, válassz egy ingatlant a törléshez!", "Figyelmeztetés", MessageBoxButton.OK, MessageBoxImage.Warning);
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

                if (dtg.SelectedItem is not Ingatlanok selectedIngatlan)
                {
                    MessageBox.Show("Kérlek, válassz ki egy ingatlant a listából!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                    return;
                }

                if (selectedIngatlan.IngatlanId < 0)
                {
                    MessageBox.Show("Érvénytelen ingatlan azonosító!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                    return;
                }

                var modositAblak = new ModositAblak(selectedIngatlan.IngatlanId, path);
                modositAblak.ShowDialog();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba történt: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
        // INGATLANOK CRUD kérésének vége
    }
}