var current = 0;
const previousButton = document.querySelector('#previous');
const nextButton = document.querySelector('#next');
const slides = document.querySelectorAll('.slider-image');

previousButton.addEventListener('click', () => {
    moveSlider(current - 1);
});

nextButton.addEventListener('click', () => {
    moveSlider(current + 1);
});

function moveSlider(i) {
    slides[current].style.left = '100%';
    current = (i + slides.length) % slides.length;
    slides[current].style.left = '0%';
}

addEventListener('DOMContentLoaded', () => {
    moveSlider(current);
    setInterval(() => {
        moveSlider(current + 1)
    }, 5 * 1000);
});
