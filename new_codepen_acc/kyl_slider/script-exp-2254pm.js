window.addEventListener("DOMContentLoaded", function(){
  //////////////////////////////////////////////////////
  
  let slides = document.querySelectorAll('.main_fade_slide');
  console.log('Number of slides found:', slides.length);

  var jsonArray = [];
  
    slides.forEach(function (slide, index) {

    var mainSlideItem = slide.querySelector('.main_slide_item');
    var mainImgDiv = slide.querySelector('.main_img_div');
    var mobileSlideItem = slide.querySelector('.mobile_slide_item');
    var mobileImgDiv = slide.querySelector('.mobile_img_div');
    var thumbLink = slide.querySelector('.thumb_link');
    var thumbImg = slide.querySelector('.thumb img');

    if (!mainSlideItem || !mainImgDiv || !mobileSlideItem || !mobileImgDiv || !thumbLink || !thumbImg) {
      console.error('Missing elements in slide number', index);
      return;
    }

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
  
    if (jsonArray.length === 0) {
      console.error('No slides were added to the array. Check the class names and HTML structure.');
      return;
    }

    function createCarousels(slidesArray) {

    const createDesktopSlide = (slide) => `
      <div class="main_slide_item" style="background-image: url('${slide.desktop.backgroundImage}');">
        <img class="main_img_div" src="${slide.desktop.image}" alt="${slide.desktop.altText}">
        <a href="${slide.desktop.link}"></a>
      </div>
    `;

    const createThumbnailSlide = (slide) => `
      <div class="thumb_slide_item">
        <div class="thumb_item_location_wrapper">
          <div class="ThumbImgTop_Pointer thumbnail_show_pin"><i class="fa-solid fa-location-dot"></i></div>
          <p class="h5 location_title">${slide.thumbnail.title}</p>
          <img src="${slide.thumbnail.image}" alt="${slide.thumbnail.altText}" title="${slide.thumbnail.title}">
  
          <a href="${slide.thumbnail.link}" class="thumb_link thumb-cta-link-dynamic show-go">
            <span class="go-button">Go</span>
            <i class="fa fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;

    let desktopCarouselHTML = '<div class="desktop_carousel">';
    let thumbnailCarouselHTML = '<div class="thumbnail_carousel">';

    slidesArray.forEach((slide) => {
      desktopCarouselHTML += createDesktopSlide(slide);
      thumbnailCarouselHTML += createThumbnailSlide(slide);
    });

    desktopCarouselHTML += '</div>';
    thumbnailCarouselHTML += '</div>';

    return {
      desktopCarouselHTML,
      thumbnailCarouselHTML
    };
  }
  
    const carouselsHTML = createCarousels(jsonArray);

  var desktopCarouselContainer = document.getElementById('desktopCarouselContainer');
  var thumbnailCarouselContainer = document.getElementById('thumbnailCarouselContainer');

  if (desktopCarouselContainer && thumbnailCarouselContainer) {
    desktopCarouselContainer.innerHTML = carouselsHTML.desktopCarouselHTML;
    thumbnailCarouselContainer.innerHTML = carouselsHTML.thumbnailCarouselHTML;

    console.log('Carousels populated and navigation set up successfully.');
  } else {
    console.error('Carousel containers not found.');
  }

    setupCarouselInterval(desktopCarouselContainer, '.main_slide_item', 2000);
  setupCarouselInterval(thumbnailCarouselContainer, '.thumb_slide_item', 2000, true);

  setupButtonEvents(desktopCarouselContainer, '.main_slide_item');
  setupButtonEvents(thumbnailCarouselContainer, '.thumb_slide_item');

  function setupButtonEvents(carouselContainer, slideSelector) {
  var nextButton = document.getElementById('arrow-slide-next');
  var prevButton = document.getElementById('arrow-slide-prev');

  var desktopSlides = carouselContainer.querySelectorAll(slideSelector);
  var thumbSlides = document.querySelectorAll('.thumb_slide_item');
  let currentActiveIndex = 0;
  let lastActiveIndex = 0; // Add this variable to store the last active index
  let autoplayInterval;
  let isAutoplayPaused = false;
  let isTransitionInProgress = false; // Add this flag


  function updateActiveSlide(index) {
    desktopSlides.forEach(slide => slide.classList.remove('active'));
    thumbSlides.forEach(slide => slide.classList.remove('active'));

    desktopSlides[index].classList.add('active');
    thumbSlides[index].classList.add('active');
  }

  function startAutoplay(startIndex) {
    isTransitionInProgress = true; // Set the flag to true when starting the transition
    autoplayInterval = setInterval(function () {
      if (!isAutoplayPaused) {
        currentActiveIndex = (startIndex + 1) % desktopSlides.length;
        updateActiveSlide(currentActiveIndex);
      }
    }, 2000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  function handleButtonClick(index) {
    console.log("button click. index ", index);
    // Stop autoplay when a button is clicked
    stopAutoplay();
    // Update the last active index
    lastActiveIndex = currentActiveIndex;
    // Update the active slide with the clicked index
    currentActiveIndex = index;
    updateActiveSlide(currentActiveIndex);
    // Start autoplay again if it wasn't paused
    // startAutoplay();
    startAutoplay(currentActiveIndex);
    // setTimeout(function () {
    //   startAutoplay(currentActiveIndex);
    // }, 2000); // Adjust the delay according to your autoplay interval
  }

  // nextButton.addEventListener('click', function () {
  //   lastActiveIndex = currentActiveIndex; // Update the last active index
  //   currentActiveIndex = (currentActiveIndex + 1) % desktopSlides.length;
  //   handleButtonClick(currentActiveIndex);
  //   // startAutoplay(currentActiveIndex);
  // });

  // prevButton.addEventListener('click', function () {
  //   lastActiveIndex = currentActiveIndex; // Update the last active index
  //   currentActiveIndex = (currentActiveIndex - 1 + desktopSlides.length) % desktopSlides.length;
  //   handleButtonClick(currentActiveIndex);
  //   // startAutoplay(currentActiveIndex);
  // });

  nextButton.addEventListener('click', function () {
    if (!isTransitionInProgress) {
      lastActiveIndex = currentActiveIndex;
      currentActiveIndex = (currentActiveIndex + 1) % desktopSlides.length;
      handleButtonClick(currentActiveIndex);
    }
  });

  prevButton.addEventListener('click', function () {
    if (!isTransitionInProgress) {
      lastActiveIndex = currentActiveIndex;
      currentActiveIndex = (currentActiveIndex - 1 + desktopSlides.length) % desktopSlides.length;
      handleButtonClick(currentActiveIndex);
    }
  });

  // Start autoplay initially
  startAutoplay(currentActiveIndex);
  // startAutoplay();
}

    function setupCarouselInterval(carouselContainer, slideSelector, interval, isThumbnail = false) {
    let currentActiveIndex = 0;
    let slides = carouselContainer.querySelectorAll(slideSelector);

    function updateActiveSlide() {
      slides.forEach(slide => slide.classList.remove('active'));
      slides[currentActiveIndex].classList.add('active');

      if (isThumbnail) {
        scrollToThumbnail(slides, currentActiveIndex, carouselContainer);
      }

      currentActiveIndex = (currentActiveIndex + 1) % slides.length;
    }

    updateActiveSlide();

    setInterval(updateActiveSlide, interval);
  }

function scrollToThumbnail(slides, index, container) {
  const thumbSlideItem = slides[index];
  const thumbSlideItemRect = thumbSlideItem.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const centerPosition = thumbSlideItemRect.left - containerRect.left + thumbSlideItemRect.width / 1.5;
  const containerCenter = containerRect.width / 1.5;

  let scrollLeftPosition = centerPosition - containerCenter;

  // Calculate the total width of active thumbnail items
  const activeThumbnails = Array.from(container.querySelectorAll('.thumb_slide_item.active'));
  const totalActiveWidth = activeThumbnails.reduce((totalWidth, thumbItem) => {
    const thumbItemRect = thumbItem.getBoundingClientRect();
    return totalWidth + thumbItemRect.width;
  }, 0);

  // Adjust the scroll position to ensure all active thumbnail items are in view
  scrollLeftPosition -= (totalActiveWidth - thumbSlideItemRect.width) / 1.5;

  const maxScrollLeftPosition = container.scrollWidth - container.offsetWidth;
  scrollLeftPosition = Math.max(0, Math.min(maxScrollLeftPosition, scrollLeftPosition));

  container.scrollLeft = scrollLeftPosition;
}

  
  
});