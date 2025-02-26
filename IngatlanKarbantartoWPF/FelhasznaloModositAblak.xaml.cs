using System;
using System.Net.Http;
using System.Text;
using System.Windows;
using Newtonsoft.Json;

namespace IngatlanKarbantartoWPF
{
    public partial class FelhasznaloModositAblak : Window
    {
        private readonly HttpClient _httpClient;
        private string _loginNev;

        public FelhasznaloModositAblak(string loginNev)
        {
            InitializeComponent();
            _httpClient = new HttpClient();
            _loginNev = loginNev;

            // Betöltjük a felhasználói adatokat
            LoadUserData();
        }

        // Felhasználó adatainak betöltése
        private async void LoadUserData()
        {
            try
            {
                string url = $"https://localhost:7079/api/Felhasznalo/{_loginNev}";
                HttpResponseMessage response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                string jsonResponse = await response.Content.ReadAsStringAsync();
                var user = JsonConvert.DeserializeObject<FelhasznaloDTO>(jsonResponse);

                // Feltöltjük a TextBox-okat és más vezérlőket
                LoginNevTextBox.Text = user.LoginNev;
                NevTextBox.Text = user.Name;
                EmailTextBox.Text = user.Email;
                ProfilePicturePathTextBox.Text = user.ProfilePicturePath;
                AktivCheckBox.IsChecked = user.Active;

                // Engedély ComboBox beállítása
                PermissionComboBox.SelectedIndex = user.PermissionId == 1 ? 0 : 1;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba történt a felhasználó adatainak betöltésekor: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // Frissítés gomb eseménykezelője
        private async void UpdateButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                // Ellenőrizzük, hogy minden kötelező mező ki van töltve
                if (string.IsNullOrEmpty(LoginNevTextBox.Text) || string.IsNullOrEmpty(NevTextBox.Text) || string.IsNullOrEmpty(EmailTextBox.Text))
                {
                    MessageBox.Show("Kérlek, töltsd ki az összes kötelező mezőt!", "Figyelmeztetés", MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                // Frissített felhasználói adatok összegyűjtése
                var updatedUser = new FelhasznaloDTO
                {
                    LoginNev = LoginNevTextBox.Text,
                    Name = NevTextBox.Text,
                    Email = EmailTextBox.Text,
                    ProfilePicturePath = ProfilePicturePathTextBox.Text,
                    Active = AktivCheckBox.IsChecked.GetValueOrDefault(), // Aktív felhasználó?
                    PermissionId = PermissionComboBox.SelectedIndex == 0 ? 1 : 2 // Engedély: Admin (1) vagy User (2)
                };

                // JSON formátumban elküldjük a frissített adatokat
                string jsonContent = JsonConvert.SerializeObject(updatedUser);
                HttpContent content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                // PUT kérés küldése
                string url = $"https://localhost:7079/api/Felhasznalo/update/{LoginNevTextBox.Text}";
                HttpResponseMessage response = await _httpClient.PutAsync(url, content);
                response.EnsureSuccessStatusCode();

                // Ha sikerült, értesítjük a felhasználót
                MessageBox.Show("Felhasználó sikeresen frissítve!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
            }
            catch (Exception ex)
            {
                // Hiba esetén értesítjük a felhasználót
                MessageBox.Show($"Hiba történt a frissítés során: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }
}
