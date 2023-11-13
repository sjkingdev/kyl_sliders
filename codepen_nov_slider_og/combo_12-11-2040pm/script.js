// Extract data from the HTML and create carousels
document.addEventListener("DOMContentLoaded", function () {

    // Get all main slide items
    const mainSlideItems = document.querySelectorAll('.main_slide_item');
    const mainSlideInner = document.querySelector('.main_slider_inner');

    // Get all thumbnail slide items
    const thumbnailSlideItems = document.querySelectorAll('.thumb_slide_item');
    const thumbSlideInner = document.querySelector('.thumb_slider_inner');

    // Create main carousel
    const mainCarousel = document.getElementById('main-carousel');
    mainSlideItems.forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('main-carousel-item');
        mainSlideInner.appendChild(clone);
    });

    // Create thumbnail carousel
    const thumbnailCarousel = document.getElementById('thumbnail-carousel');
    thumbnailSlideItems.forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('thumbnail-carousel-item');
        thumbSlideInner.appendChild(clone);
    });

});