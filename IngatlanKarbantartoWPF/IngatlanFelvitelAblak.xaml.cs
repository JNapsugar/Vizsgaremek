using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Windows;
using static IngatlanKarbantartoWPF.MainWindow;

namespace IngatlanKarbantartoWPF
{
    public partial class FelvitelAblak : Window
    {
        private readonly HttpClient _httpClient = new HttpClient();
        private readonly string _path;

        public Ingatlanok UjIngatlan { get; private set; }

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

            if (!int.TryParse(MeretTextBox.Text, out var meret) ||
                !int.TryParse(SzobaTextBox.Text, out var szoba) ||
                !int.TryParse(TulajdonosIdTextBox.Text, out var tulajdonosId))
            {
                MessageBox.Show("Érvénytelen számformátum!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            UjIngatlan = new Ingatlanok
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

            this.DialogResult = true;
            this.Close();
        }
    }
}