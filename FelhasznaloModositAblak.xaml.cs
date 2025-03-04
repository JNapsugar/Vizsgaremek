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
        private int _userId;

        public FelhasznaloModositAblak(string loginNev, string path, int userId)
        {
            InitializeComponent();
            _httpClient = new HttpClient();
            _loginNev = loginNev;
            _userId = userId;

            LoadUserData();
        }

        private async void LoadUserData()
        {
            try
            {
                string url = $"https://localhost:7079/api/Felhasznalo/felhasznalo/{_userId}";
                HttpResponseMessage response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                string jsonResponse = await response.Content.ReadAsStringAsync();
                var user = JsonConvert.DeserializeObject<FelhasznaloDTO>(jsonResponse);

                LoginNevTextBox.Text = user.LoginNev;
                NevTextBox.Text = user.Name;
                EmailTextBox.Text = user.Email;
                ProfilePicturePathTextBox.Text = user.ProfilePicturePath;
                AktivCheckBox.IsChecked = user.Active;

                PermissionComboBox.SelectedIndex = user.PermissionId == 1 ? 0 : 1;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba történt a felhasználó adatainak betöltésekor: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private async void UpdateButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (string.IsNullOrEmpty(LoginNevTextBox.Text) || string.IsNullOrEmpty(NevTextBox.Text) || string.IsNullOrEmpty(EmailTextBox.Text))
                {
                    MessageBox.Show("Kérlek, töltsd ki az összes kötelező mezőt!", "Figyelmeztetés", MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                var updatedUser = new FelhasznaloDTO
                {
                    LoginNev = LoginNevTextBox.Text,
                    Name = NevTextBox.Text,
                    Email = EmailTextBox.Text,
                    ProfilePicturePath = ProfilePicturePathTextBox.Text,
                    PermissionId = PermissionComboBox.SelectedIndex == 0 ? 1 : 2, // Admin (1) vagy User (2)
                    Password = JelszoPasswordBox.Password
                };

                string jsonContent = JsonConvert.SerializeObject(updatedUser);
                HttpContent content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                string url = $"https://localhost:7079/api/Felhasznalo/{_loginNev}";
                HttpResponseMessage response = await _httpClient.PutAsync(url, content);
                response.EnsureSuccessStatusCode();

                LoginNevTextBox.Text = updatedUser.LoginNev;
                NevTextBox.Text = updatedUser.Name;
                EmailTextBox.Text = updatedUser.Email;
                ProfilePicturePathTextBox.Text = updatedUser.ProfilePicturePath;
                AktivCheckBox.IsChecked = updatedUser.Active;
                PermissionComboBox.SelectedIndex = updatedUser.PermissionId == 1 ? 0 : 1;

                MessageBox.Show("Felhasználó sikeresen frissítve!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                this.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba történt a frissítés során: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

    }
}