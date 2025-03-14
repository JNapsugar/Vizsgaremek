using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using System.Net.Http.Json;

namespace IngatlanKarbantartoWPF
{
    /// <summary>
    /// Interaction logic for FoglalasModositAblak.xaml
    /// </summary>
    public partial class FoglalasModositAblak : Window
    {
        private readonly HttpClient _httpClient;
        private readonly int _FoglalasId;
        private FoglalasDTO _originalFoglalasData;
        private int foglalasId;

        public FoglalasModositAblak(int foglalasId)
        {
            InitializeComponent();
            this.foglalasId = foglalasId;
            _httpClient = new HttpClient();
            LoadFoglalasData();
        }

        private async void LoadFoglalasData()
        {
            // API hívás, hogy betöltsük a foglalás adatokat
            string url = $"https://localhost:7079/api/Foglalasok//{_FoglalasId}";
            HttpResponseMessage response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var foglalas = await response.Content.ReadFromJsonAsync<FoglalasDTO>();

                // Adatok betöltése a megfelelő mezőkbe
                FoglalasIdTextBox.Text = foglalas.FoglalasId.ToString();
                IngatlanIdTextBox.Text = foglalas.IngatlanId.ToString();
                BerloIdTextBox.Text = foglalas.BerloId.ToString();
                KezdesDatumDatePicker.SelectedDate = foglalas.KezdesDatum;
                BefejezesDatumDatePicker.SelectedDate = foglalas.BefejezesDatum;
                AllapotComboBox.SelectedItem = foglalas.Allapot;
            }
            else
            {
                MessageBox.Show("Nem sikerült betölteni a foglalás adatokat.", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private async void UpdateButton_Click(object sender, RoutedEventArgs e)
        {
            // A módosított foglalás adatainak összegyűjtése
            var updatedFoglalas = new FoglalasDTO
            {
                FoglalasId = this.foglalasId,
                IngatlanId = int.Parse(IngatlanIdTextBox.Text),
                BerloId = int.Parse(BerloIdTextBox.Text),
                KezdesDatum = KezdesDatumDatePicker.SelectedDate ?? DateTime.Now,
                BefejezesDatum = BefejezesDatumDatePicker.SelectedDate ?? DateTime.Now,
                Allapot = ((ComboBoxItem)AllapotComboBox.SelectedItem)?.Content.ToString()
            };

            // API hívás a módosított adat frissítésére
            string url = $"https://localhost:7079/api/Foglalasok/{foglalasId}";
            HttpResponseMessage response = await _httpClient.PutAsJsonAsync(url, updatedFoglalas);

            if (response.IsSuccessStatusCode)
            {
                MessageBox.Show("A foglalás sikeresen frissítve.", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                this.Close(); // Zárja be az ablakot
            }
            else
            {
                MessageBox.Show("A foglalás frissítése nem sikerült.", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        public class FoglalasDTO
        {
            public int FoglalasId { get; set; }
            public int IngatlanId { get; set; }
            public int BerloId { get; set; }
            public DateTime KezdesDatum { get; set; }
            public DateTime BefejezesDatum { get; set; }
            public string? Allapot { get; set; }
        }
    }
}