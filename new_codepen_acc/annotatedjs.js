window.addEventListener("DOMContentLoaded", function(){

    // Find all elements with the class 'main_fade_slide'
    let slides = document.querySelectorAll('.main_fade_slide');
    console.log('Number of slides found:', slides.length);
  
    // Array to store JSON objects representing each slide
    var jsonArray = [];
  
    // Iterate over each slide element and extract information
    slides.forEach(function (slide, index) {
  
      // Extracting elements from the current slide
      var mainSlideItem = slide.querySelector('.main_slide_item');
      var mainImgDiv = slide.querySelector('.main_img_div');
      var mobileSlideItem = slide.querySelector('.mobile_slide_item');
      var mobileImgDiv = slide.querySelector('.mobile_img_div');
      var thumbLink = slide.querySelector('.thumb_link');
      var thumbImg = slide.querySelector('.thumb img');
  
      // Check if any of the required elements are missing
      if (!mainSlideItem || !mainImgDiv || !mobileSlideItem || !mobileImgDiv || !thumbLink || !thumbImg) {
        console.error('Missing elements in slide number', index);
        return;
      }
  
      // Create a JSON object for the current slide and add it to the array
      var jsonObj = {
        desktop: {
          link: mainSlideItem.getAttribute('data-link'),
          backgroundImage: mainSlideItem.style.backgroundImage.slice(5, -2).replace(/"/g, ""),
          image: mainImgDiv.src,
          altText: mainImgDiv.alt
        },
        mobile: {
          link: mobileSlideItem.getAttribute('data-link'),
          backgroundImage: mobileSlideItem.style.backgroundImage.slice(5, -2).replace(/"/g, ""),
          image: mobileImgDiv.src,
          altText: mobileImgDiv.alt
        },
        thumbnail: {
          link: thumbLink.getAttribute('href'),
          image: thumbImg.src,
          altText: thumbImg.alt,
          title: thumbImg.title
        }
      };
      jsonArray.push(jsonObj);
    });
  
    // Check if any slides were added to the array
    if (jsonArray.length === 0) {
      console.error('No slides were added to the array. Check the class names and HTML structure.');
      return;
    }
  
    // Function to create HTML for desktop and thumbnail carousels
    function createCarousels(slidesArray) {
      // ... (See the code for the implementation)
    }
  
    // Generate HTML for desktop and thumbnail carousels
    const carouselsHTML = createCarousels(jsonArray);
  
    // Get carousel container elements by ID
    var desktopCarouselContainer = document.getElementById('desktopCarouselContainer');
    var thumbnailCarouselContainer = document.getElementById('thumbnailCarouselContainer');
  
    // Check if carousel containers were found
    if (desktopCarouselContainer && thumbnailCarouselContainer) {
      // Populate carousel containers with HTML
      desktopCarouselContainer.innerHTML = carouselsHTML.desktopCarouselHTML;
      thumbnailCarouselContainer.innerHTML = carouselsHTML.thumbnailCarouselHTML;
  
      console.log('Carousels populated and navigation set up.');
    } else {
      console.error('Carousel containers not found.');
    }
  
    // Set up interval for automatic sliding of desktop and thumbnail carousels
    setupCarouselInterval(desktopCarouselContainer, '.main_slide_item', 3000);
    setupCarouselInterval(thumbnailCarouselContainer, '.thumb_slide_item', 3000, true);
  
    // Set up button click events for desktop and thumbnail carousels
    setupButtonEvents(desktopCarouselContainer, '.main_slide_item');
    setupButtonEvents(thumbnailCarouselContainer, '.thumb_slide_item');
  
    // Function to set up button click events for desktop and thumbnail carousels
    function setupButtonEvents(carouselContainer, slideSelector) {
      // ... (See the code for the implementation)
    }
  
    // Function to set up interval for automatic sliding of carousels
    function setupCarouselInterval(carouselContainer, slideSelector, interval, isThumbnail = false) {
      // ... (See the code for the implementation)
    }
  
    // Function to scroll to the active thumbnail in the thumbnail carousel
    function scrollToThumbnail(slides, index, container) {
      // ... (See the code for the implementation)
    }
  
  });
  