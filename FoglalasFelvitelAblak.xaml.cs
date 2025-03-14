using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
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

namespace IngatlanKarbantartoWPF
{
    /// <summary>
    /// Interaction logic for FoglalasFelvitelAblak.xaml
    /// </summary>
    public partial class FoglalasFelvitelAblak : Window
    {
        private readonly HttpClient _httpClient = new HttpClient { BaseAddress = new Uri("https://localhost:7079/api/") };
        private readonly string _path;

        public FoglalasDTO ujFoglalas {  get; private set; }
        public FoglalasFelvitelAblak(string path)
        {
            InitializeComponent();
            _path = path;
            _httpClient.BaseAddress = new Uri("https://localhost:7079/api/");
        }

        public event Action FoglalasHozzaadva;

        private void Submit_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                int ingatlanId = int.Parse(IngatlanIdTextBox.Text);
                int berloId = int.Parse(BerloIdTextBox.Text);
                DateTime kezdesDatum = KezdesDatumPicker.SelectedDate ?? DateTime.Now;
                DateTime befejezesDatum = BefejezesDatumPicker.SelectedDate ?? DateTime.Now;
                string allapot = ((ComboBoxItem)AllapotComboBox.SelectedItem).Content.ToString();

                FoglalasDTO ujFoglalas = new FoglalasDTO
                {
                    IngatlanId = ingatlanId,
                    BerloId = berloId,
                    KezdesDatum = kezdesDatum,
                    BefejezesDatum = befejezesDatum,
                    Allapot = allapot
                };

                MessageBox.Show("Foglalás sikeresen rögzítve!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                this.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba történt: {ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
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
