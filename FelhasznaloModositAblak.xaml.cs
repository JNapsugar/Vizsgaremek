using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using Newtonsoft.Json;

namespace IngatlanKarbantartoWPF
{
    public partial class FelhasznaloModositAblak : Window
    {
        private readonly HttpClient _httpClient;
        private readonly int _userId;
        private FelhasznaloDTO _originalUserData;

        public FelhasznaloModositAblak(int userId)
        {
            InitializeComponent();
            _httpClient = new HttpClient();
            _userId = userId;

            LoadUserData();
        }

        private async void LoadUserData()
        {
            try
            {
                string url = $"https://localhost:7079/api/Felhasznalo/felhasznalo/{_userId}";
                HttpResponseMessage response = await _httpClient.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Hiba a felhasználói adatok lekérésekor!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                    return;
                }

                string jsonResponse = await response.Content.ReadAsStringAsync();
                _originalUserData = JsonConvert.DeserializeObject<FelhasznaloDTO>(jsonResponse);

                if (_originalUserData != null)
                {
                    LoginNevTextBox.Text = _originalUserData.LoginNev;
                    NevTextBox.Text = _originalUserData.Name;
                    EmailTextBox.Text = _originalUserData.Email;
                    ProfilePicturePathTextBox.Text = _originalUserData.ProfilePicturePath;
                    AktivCheckBox.IsChecked = _originalUserData.Active;
                    PermissionComboBox.SelectedIndex = _originalUserData.PermissionId == 1 ? 0 : 1;
                }
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
                if (string.IsNullOrWhiteSpace(LoginNevTextBox.Text) ||
                    string.IsNullOrWhiteSpace(NevTextBox.Text) ||
                    string.IsNullOrWhiteSpace(EmailTextBox.Text))
                {
                    MessageBox.Show("Kérlek, töltsd ki az összes kötelező mezőt!", "Figyelmeztetés", MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                var updatedUser = new UpdateUserDTO
                {
                    LoginNev = LoginNevTextBox.Text,
                    Name = NevTextBox.Text,
                    Email = EmailTextBox.Text,
                    ProfilePicturePath = ProfilePicturePathTextBox.Text,
                    PermissionId = PermissionComboBox.SelectedIndex == 0 ? 1 : 2,
                    Password = string.IsNullOrEmpty(JelszoPasswordBox.Password) ? null : JelszoPasswordBox.Password
                };

                string jsonContent = JsonConvert.SerializeObject(updatedUser);
                HttpContent content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                string url = $"https://localhost:7079/api/Felhasznalo/{_userId}";
                HttpResponseMessage response = await _httpClient.PutAsync(url, content);

                if (!response.IsSuccessStatusCode)
                {
                    string errorResponse = await response.Content.ReadAsStringAsync();
                    MessageBox.Show($"Hiba a frissítés során: {errorResponse}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                    return;
                }

                _originalUserData.LoginNev = updatedUser.LoginNev;
                _originalUserData.Name = updatedUser.Name;
                _originalUserData.Email = updatedUser.Email;
                _originalUserData.ProfilePicturePath = updatedUser.ProfilePicturePath;
                _originalUserData.PermissionId = updatedUser.PermissionId ?? 1;

                LoginNevTextBox.Text = updatedUser.LoginNev;
                NevTextBox.Text = updatedUser.Name;
                EmailTextBox.Text = updatedUser.Email;
                ProfilePicturePathTextBox.Text = updatedUser.ProfilePicturePath;
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

    public class UpdateUserDTO
    {
        public string LoginNev { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string ProfilePicturePath { get; set; }
        public int? PermissionId { get; set; }
        public string Password { get; set; }
    }
}
