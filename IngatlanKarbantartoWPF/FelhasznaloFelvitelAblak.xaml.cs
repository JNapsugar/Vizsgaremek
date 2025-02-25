using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Windows;

namespace IngatlanKarbantartoWPF
{
    public partial class FelhasznaloFelvitelAblak : Window
    {
        private readonly HttpClient _httpClient = new HttpClient();
        private readonly string _path = "https://localhost:7079/api/Felhasznalo";

        public FelhasznaloDTO UjFelhasznalo { get; private set; }

        public FelhasznaloFelvitelAblak()
        {
            InitializeComponent();
        }

        private async void Submit_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(LoginNevTextBox.Text) ||
                string.IsNullOrWhiteSpace(PasswordTextBox.Password) ||
                string.IsNullOrWhiteSpace(NameTextBox.Text) ||
                string.IsNullOrWhiteSpace(EmailTextBox.Text) ||
                string.IsNullOrWhiteSpace(PermissionIdTextBox.Text))
            {
                MessageBox.Show("Minden mezőt ki kell tölteni!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (!int.TryParse(PermissionIdTextBox.Text, out var permissionId))
            {
                MessageBox.Show("A jogosultság azonosítója érvénytelen!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            UjFelhasznalo = new FelhasznaloDTO
            {
                LoginNev = LoginNevTextBox.Text,
                Password = PasswordTextBox.Password,
                Name = NameTextBox.Text,
                Email = EmailTextBox.Text,
                PermissionId = permissionId,
                Active = true,
                ProfilePicturePath = ProfilePicturePathTextBox.Text
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(UjFelhasznalo), Encoding.UTF8, "application/json");

            try
            {
                var response = await _httpClient.PostAsync(_path, jsonContent);

                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Felhasználó sikeresen hozzáadva!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                    this.DialogResult = true;
                    this.Close();
                }
                else
                {
                    MessageBox.Show($"Hiba történt: {response.StatusCode}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba történt a kérés során: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }

    public class FelhasznaloDTO
    {
        public string LoginNev { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public int PermissionId { get; set; }
        public bool Active { get; set; }
        public string ProfilePicturePath { get; set; }
    }
}
