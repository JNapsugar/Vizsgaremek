using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using static IngatlanKarbantartoWPF.MainWindow;

namespace IngatlanKarbantartoWPF
{
    /// <summary>
    /// Interaction logic for ModositAblak.xaml
    /// </summary>
    public partial class ModositAblak : Window
    {
        private readonly HttpClient _httpClient = new HttpClient();
        private string path;
        private int ingatlanId;

        public ModositAblak(string path, int ingatlanId)
        {
            InitializeComponent();
            this.path = path;
            this.ingatlanId = ingatlanId;
            LoadIngatlanData();
        }

        private async void LoadIngatlanData()
        {
            string url = $"https://localhost:7079/api/{path}/{ingatlanId}";
            HttpResponseMessage response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            string responseContent = await response.Content.ReadAsStringAsync();
            var ingatlan = JsonSerializer.Deserialize<Ingatlanok>(responseContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            // Adatok betöltése a textboxokba
            CimTextBox.Text = ingatlan.Cim;
            LeirasTextBox.Text = ingatlan.Leiras;
            HelyszinTextBox.Text = ingatlan.Helyszin;
            ArTextBox.Text = ingatlan.Ar.ToString();
        }

        private async void UpdateButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var updatedIngatlan = new Ingatlanok
                {
                    IngatlanId = ingatlanId,
                    Cim = CimTextBox.Text,
                    Leiras = LeirasTextBox.Text,
                    Helyszin = HelyszinTextBox.Text,
                    Ar = decimal.Parse(ArTextBox.Text),
                };

                string url = $"https://localhost:7079/api/{path}/{ingatlanId}";
                string jsonContent = JsonSerializer.Serialize(updatedIngatlan);
                StringContent content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await _httpClient.PutAsync(url, content);
                response.EnsureSuccessStatusCode();

                MessageBox.Show("Sikeres frissítés!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                this.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba történt: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }
}