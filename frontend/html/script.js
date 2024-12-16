//Header
const images = document.getElementsByClassName("headerImage")
let Index = 0

function changeImage() {
    images[Index].classList.remove("active")
    Index = (Index + 1) % images.length
    images[Index].classList.add("active")
}

setInterval(changeImage, 3000)


//Filter
const filterDiv = document.getElementById('filter')
const showMoreFilter = document.getElementById('showMoreFilter')
const filterMore = document.getElementById('filterMore')

showMoreFilter.addEventListener('click', () => {
    
    if (showMoreFilter.innerHTML == 'További<br>▼') {
        filterDiv.style.height = '18rem'
        showMoreFilter.innerHTML = 'Kevesebb<br>▲'
        filterMore.style.opacity = 1 

    } else {
        filterDiv.style.height = '10rem'
        showMoreFilter.innerHTML = 'További<br>▼'
        filterMore.style.opacity = 0 
    }
});


//Cardok
for (let i = 0; i < 12; i++) {
    document.getElementById("cards").innerHTML += `
    <div class = "card">
            <img src="img/placeholder.jpg">
            <div class="card-content">
                <h2>Helyszin <span class="price">ft/ejszaka</span></h2>
                <div class="TovabbiInformaciok"><p>Szobák száma<br>még valamik</p></div><br>
                <button>További információk</button>
            </div>
        </div>
    `
    
}

