const images = document.getElementsByClassName("headerImage");
let Index = 0;

function changeImage() {
    images[Index].classList.remove("active");
    Index = (Index + 1) % images.length;
    images[Index].classList.add("active");
}

setInterval(changeImage, 3000);
