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

                // Az UI frissítése
                CimTextBox.Text = loadedIngatlan.Cim;
                LeirasTextBox.Text = loadedIngatlan.Leiras ?? string.Empty;
                HelyszinTextBox.Text = loadedIngatlan.Helyszin ?? string.Empty;
                ArTextBox.Text = loadedIngatlan.Ar.ToString();
                MeretTextBox.Text = loadedIngatlan.Meret.ToString() ?? string.Empty;
                SzobaTextBox.Text = loadedIngatlan.Szoba.ToString();
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
                var updatedIngatlan = new Ingatlanok
                {
                    IngatlanId = ingatlanId,
                    Cim = CimTextBox.Text,
                    Leiras = LeirasTextBox.Text,
                    Helyszin = HelyszinTextBox.Text,
                    Ar = decimal.Parse(ArTextBox.Text),
                    Meret =  int.Parse(MeretTextBox.Text),
                    Szoba = int.Parse(SzobaTextBox.Text)
                };

                bool hasChanges = !AreObjectsEqual(loadedIngatlan, updatedIngatlan);

                if (hasChanges)
                {
                    string url = $"https://localhost:7079/api/{path}/{ingatlanId}";
                    string jsonContent = JsonSerializer.Serialize(updatedIngatlan);
                    StringContent content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                    HttpResponseMessage response = await _httpClient.PutAsync(url, content);
                    response.EnsureSuccessStatusCode();

                    MessageBox.Show("Sikeres frissítés!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                    this.Close();
                }
                else
                {
                    MessageBox.Show("Nincs változás az adatokban.", "Figyelmeztetés", MessageBoxButton.OK, MessageBoxImage.Information);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba történt: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private bool AreObjectsEqual(Ingatlanok original, Ingatlanok updated)
        {
            return original.Cim == updated.Cim &&
                   original.Leiras == updated.Leiras &&
                   original.Helyszin == updated.Helyszin &&
                   original.Ar == updated.Ar &&
                   original.Meret == updated.Meret &&
                   original.Szoba == updated.Szoba;
        }
    }
}