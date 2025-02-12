using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Windows;

namespace IngatlanKarbantartoWPF
{
    public partial class FelvitelAblak : Window
    {
        private readonly HttpClient _httpClient = new HttpClient();
        private readonly string _path;

        public FelvitelAblak(string path)
        {
            InitializeComponent();
            _path = path;
        }

        private async void Submit_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(CimTextBox.Text) ||
                string.IsNullOrWhiteSpace(LeirasTextBox.Text) ||
                string.IsNullOrWhiteSpace(HelyszinTextBox.Text) ||
                string.IsNullOrWhiteSpace(ArTextBox.Text) ||
                string.IsNullOrWhiteSpace(MeretTextBox.Text) ||
                string.IsNullOrWhiteSpace(SzolgaltatasokTextBox.Text) ||
                string.IsNullOrWhiteSpace(SzobaTextBox.Text) ||
                string.IsNullOrWhiteSpace(TulajdonosIdTextBox.Text))
            {
                MessageBox.Show("Minden mezőt ki kell tölteni!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (!decimal.TryParse(ArTextBox.Text, out var ar))
            {
                MessageBox.Show("Az ár érvénytelen. Kérjük, adjon meg egy helyes számot.", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (!int.TryParse(MeretTextBox.Text, out var meret))
            {
                MessageBox.Show("A méret érvénytelen. Kérjük, adjon meg egy helyes számot.", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (!int.TryParse(SzobaTextBox.Text, out var szoba))
            {
                MessageBox.Show("A szoba érvénytelen. Kérjük, adjon meg egy helyes számot.", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (!int.TryParse(TulajdonosIdTextBox.Text, out var tulajdonosId))
            {
                MessageBox.Show("A tulajdonos ID érvénytelen. Kérjük, adjon meg egy helyes számot.", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            var ujIngatlan = new
            {
                Cim = CimTextBox.Text,
                Leiras = LeirasTextBox.Text,
                Helyszin = HelyszinTextBox.Text,
                Ar = ar,
                Meret = meret,  
                Szolgaltatasok = SzolgaltatasokTextBox.Text,
                Szoba = szoba,
                TulajdonosId = tulajdonosId 
            };

            var content = new StringContent(JsonSerializer.Serialize(ujIngatlan), Encoding.UTF8, "application/json");

            string url = $"https://localhost:7079/api/{_path}";

            try
            {
                HttpResponseMessage response = await _httpClient.PostAsync(url, content);

                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Sikeresen mentve!", "Információ", MessageBoxButton.OK, MessageBoxImage.Information);
                }
                else
                {
                    string errorMessage = await response.Content.ReadAsStringAsync();
                    MessageBox.Show($"Hiba történt! Státuszkód: {response.StatusCode}\nÜzenet: {errorMessage}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba történt a kérés küldése közben: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }

            this.Close();
        }
    }
}