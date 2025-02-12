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
            public string Cim { get; set; }
            public string? Leiras { get; set; }
            public string? Helyszin { get; set; }
            public decimal Ar { get; set; }
            public int? Meret { get; set; }
            public string? Szolgaltatasok { get; set; }
            public DateTime FeltoltesDatum { get; set; }
            public int Szoba { get; set; }
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

                // Adatok megjelenítése a DataGrid-ben
                dtg.ItemsSource = ingatlanok;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba történt: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void POST_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrEmpty(path))
            {
                MessageBox.Show("Kérlek, válassz egy végpontot!", "Figyelmeztetés", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            var felvitelAblak = new FelvitelAblak(path);
            felvitelAblak.ShowDialog();
        }

        private void DELETE_Click(object sender, RoutedEventArgs e)
        {
            
        }

        private void PUT_Click(object sender, RoutedEventArgs e)
        {

        }

        // INGATLANOK CRUD kérésének vége
    }
}