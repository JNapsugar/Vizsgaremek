using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Windows;
using System.Windows.Controls;

namespace IngatlanKarbantartoWPF
{
    public partial class FoglalasModositAblak : Window
    {
        private static readonly HttpClient _httpClient = new HttpClient();
        private readonly int _foglalasId;
        private readonly string ingatlanId;

        public FoglalasModositAblak(int foglalasId)
        {
            InitializeComponent();
            _foglalasId = foglalasId;
            LoadFoglalasData();
        }

        private async void LoadFoglalasData()
        {
            try
            {
                string url = $"https://localhost:7079/api/Foglalasok/ingatlan/{ingatlanId}";
                HttpResponseMessage response = await _httpClient.GetAsync(url);

                if (response.IsSuccessStatusCode)
                {
                    var responseString = await response.Content.ReadAsStringAsync();

                    Console.WriteLine("Kapott válasz: " + responseString);

                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };

                    var foglalas = JsonSerializer.Deserialize<Foglalas>(responseString, options);

                    if (foglalas != null)
                    {
                        FoglalasIdTextBox.Text = foglalas.FoglalasId.ToString();
                        IngatlanIdTextBox.Text = foglalas.IngatlanId.ToString();
                        BerloIdTextBox.Text = foglalas.BerloId.ToString();
                        KezdesDatumDatePicker.SelectedDate = foglalas.KezdesDatum;
                        BefejezesDatumDatePicker.SelectedDate = foglalas.BefejezesDatum;

                        var selectedItem = AllapotComboBox.Items
                            .Cast<ComboBoxItem>()
                            .FirstOrDefault(item => item.Content.ToString() == foglalas.Allapot);

                        AllapotComboBox.SelectedItem = selectedItem;
                    }
                }
                else
                {
                    MessageBox.Show($"Nem sikerült betölteni a foglalás adatokat. Státusz: {response.StatusCode}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba történt az adatok betöltése során: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private async void UpdateButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var updatedBooking = new
                {
                    KezdesDatum = KezdesDatumDatePicker.SelectedDate ?? DateTime.Now,
                    BefejezesDatum = BefejezesDatumDatePicker.SelectedDate ?? DateTime.Now,
                    Allapot = (AllapotComboBox.SelectedItem as ComboBoxItem)?.Content.ToString()
                };

                string url = $"https://localhost:7079/api/Foglalasok/modositas/{_foglalasId}";
                var response = await _httpClient.PutAsJsonAsync(url, updatedBooking);

                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("A foglalás sikeresen módosítva!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                    this.Close();
                }
                else
                {
                    string errorMessage = await response.Content.ReadAsStringAsync();
                    MessageBox.Show($"Hiba történt: {errorMessage}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba történt: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        public class Foglalas
        {
            public int FoglalasId { get; set; }
            public int IngatlanId { get; set; }
            public int BerloId { get; set; }
            public DateTime KezdesDatum { get; set; }
            public DateTime BefejezesDatum { get; set; }
            public string Allapot { get; set; }
        }
    }
}