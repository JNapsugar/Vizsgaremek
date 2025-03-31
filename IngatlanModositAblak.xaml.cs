using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Windows;
using static IngatlanKarbantartoWPF.MainWindow;

namespace IngatlanKarbantartoWPF
{
    public partial class ModositAblak : Window
    {
        private readonly HttpClient _httpClient = new HttpClient();
        private readonly int ingatlanId;
        private readonly string path;
        private static Ingatlanok loadedIngatlan;

        public ModositAblak(int ingatlanId, string path)
        {
            InitializeComponent();

            this.ingatlanId = ingatlanId;
            this.path = path;

            LoadIngatlanData();
        }

        private async void LoadIngatlanData()
        {
            try
            {
                string url = $"https://localhost:7079/api/{path}/{ingatlanId}";
                HttpResponseMessage response = await _httpClient.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                {
                    throw new HttpRequestException($"A szerver hibás választ adott: {response.StatusCode} - {response.ReasonPhrase}");
                }

                string responseContent = await response.Content.ReadAsStringAsync();

                if (string.IsNullOrWhiteSpace(responseContent))
                {
                    throw new Exception("A szerver üres választ adott az ingatlan adatainak lekérésekor.");
                }

                var ingatlan = JsonSerializer.Deserialize<Ingatlanok>(responseContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (ingatlan == null)
                {
                    throw new JsonException("A JSON deszerializálás sikertelen. Az adatok formátuma nem megfelelő.");
                }

                loadedIngatlan = ingatlan;

                CimTextBox.Text = loadedIngatlan.Cim;
                LeirasTextBox.Text = loadedIngatlan.Leiras ?? string.Empty;
                HelyszinTextBox.Text = loadedIngatlan.Helyszin ?? string.Empty;
                ArTextBox.Text = loadedIngatlan.Ar.ToString();
                MeretTextBox.Text = loadedIngatlan.Meret.ToString() ?? string.Empty;
                SzobaTextBox.Text = loadedIngatlan.Szoba.ToString();
                SzolgaltatasokTextBox.Text = loadedIngatlan.Szolgaltatasok ?? string.Empty;
            }
            catch (HttpRequestException httpEx)
            {
                MessageBox.Show($"Hálózati hiba történt: {httpEx.Message}\nEllenőrizze az internetkapcsolatot és a szerver elérhetőségét.",
                    "Hálózati hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
            }
            catch (JsonException jsonEx)
            {
                MessageBox.Show($"Adatfeldolgozási hiba: {jsonEx.Message}\nA szerver nem megfelelő formátumban küldte az adatokat.",
                    "Adatfeldolgozási hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
            catch (TaskCanceledException)
            {
                MessageBox.Show("Az adatok lekérése időtúllépés miatt sikertelen.\nPróbálja meg később újra.",
                    "Időtúllépés", MessageBoxButton.OK, MessageBoxImage.Warning);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Váratlan hiba történt: {ex.Message}\nPróbálja újra később, vagy forduljon a rendszergazdához.",
                    "Ismeretlen hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private async void UpdateButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var updatedIngatlanDTO = new IngatlanDTO
                {
                    Cim = CimTextBox.Text,
                    Leiras = LeirasTextBox.Text,
                    Helyszin = HelyszinTextBox.Text,
                    Ar = decimal.Parse(ArTextBox.Text),
                    Meret = int.Parse(MeretTextBox.Text),
                    Szoba = int.Parse(SzobaTextBox.Text),
                    Szolgaltatasok = SzolgaltatasokTextBox.Text,
                    FeltoltesDatum = DateTime.UtcNow,
                    TulajdonosId = loadedIngatlan.TulajdonosId
                };

                string url = $"https://localhost:7079/api/{path}/{ingatlanId}";
                string jsonContent = JsonSerializer.Serialize(updatedIngatlanDTO);
                StringContent content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await _httpClient.PutAsync(url, content);
                response.EnsureSuccessStatusCode();

                CimTextBox.Text = updatedIngatlanDTO.Cim;
                LeirasTextBox.Text = updatedIngatlanDTO.Leiras;
                HelyszinTextBox.Text = updatedIngatlanDTO.Helyszin;
                ArTextBox.Text = updatedIngatlanDTO.Ar.ToString();
                MeretTextBox.Text = updatedIngatlanDTO.Meret.ToString();
                SzolgaltatasokTextBox.Text = updatedIngatlanDTO.Szolgaltatasok;

                MessageBox.Show("Sikeres frissítés!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                this.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba történt: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        public class IngatlanDTO
        {
            public int IngatlanId { get; set; }
            public string Cim { get; set; } = null!;
            public string? Leiras { get; set; }
            public string? Helyszin { get; set; }
            public decimal Ar { get; set; }
            public int Meret { get; set; }
            public string Szolgaltatasok { get; set; }
            public DateTime FeltoltesDatum { get; set; }
            public int Szoba { get; set; }
            public int TulajdonosId { get; set; }
        }
    }
}