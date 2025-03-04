using IngatlanKarbantartoWPF;
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

namespace WpfLoginApp
{
    public partial class Login : Window
    {
        private readonly HttpClient _httpClient = new HttpClient();
        private const string LoginUrl = "https://localhost:7079/api/Felhasznalo/login";

        public Login()
        {
            InitializeComponent();
        }

        private async void LoginButton_Click(object sender, RoutedEventArgs e)
        {
            string username = UsernameTextBox.Text;
            string password = PasswordBox.Password;

            var loginRequest = new { loginName = username, password = password };
            var jsonRequest = JsonSerializer.Serialize(loginRequest);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            try
            {
                HttpResponseMessage response = await _httpClient.PostAsync(LoginUrl, content);
                response.EnsureSuccessStatusCode();

                string responseContent = await response.Content.ReadAsStringAsync();
                var loginResponse = JsonSerializer.Deserialize<LoginResponse>(responseContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                MessageBox.Show($"Sikeresen bejelentkezett: {loginResponse.User.Name}!");

                //MessageBox.Show($"{loginResponse.Message}\nNév: {loginResponse.User.Name}\nEmail: {loginResponse.User.Email}", "Bejelentkezés sikeres", MessageBoxButton.OK, MessageBoxImage.Information);

                MainWindow.isLoggedIn = true;
                this.Close();

            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba történt: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }


        public class LoginResponse
        {
            public string Message { get; set; }
            public string Token { get; set; }
            public User User { get; set; }
        }

        public class User
        {
            public int Id { get; set; }
            public string LoginNev { get; set; }
            public string Name { get; set; }
            public string Email { get; set; }
            public int PermissionId { get; set; }
        }
    }
}