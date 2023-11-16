document.addEventListener("DOMContentLoaded", function () {
  // Find all elements with the class 'main_fade_slide'
  var slides = document.querySelectorAll('.main_fade_slide');
  console.log('Number of slides found:', slides.length);

  // Create an array to store slide information
  var jsonArray = [];

  // Iterate through each slide
  slides.forEach(function (slide, index) {
    // Find elements within each slide
    var mainSlideItem = slide.querySelector('.main_slide_item');
    var mainImgDiv = slide.querySelector('.main_img_div');
    var mobileSlideItem = slide.querySelector('.mobile_slide_item');
    var mobileImgDiv = slide.querySelector('.mobile_img_div');
    var thumbLink = slide.querySelector('.thumb_link');
    var thumbImg = slide.querySelector('.thumb img');

    // Check for missing elements
    if (!mainSlideItem || !mainImgDiv || !mobileSlideItem || !mobileImgDiv || !thumbLink || !thumbImg) {
      console.error('Missing elements in slide number', index);
      return;
    }

    // Create a JSON object for each slide and add it to the array
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

  // Check if slides were added to the array
  if (jsonArray.length === 0) {
    console.error('No slides were added to the array. Check the class names and HTML structure.');
    return;
  }

  // Function to create HTML for carousels
  function createCarousels(slidesArray) {
    var desktopCarouselHTML = '<div class="desktop_carousel">';
    var thumbnailCarouselHTML = '<div class="thumbnail_carousel">';

    // Iterate through each slide and create HTML
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

  // Function to create HTML for desktop slide
  function createDesktopSlide(slide) {
    return `
      <div class="main_slide_item" style="background-image: url('${slide.desktop.backgroundImage}');">
        <img class="main_img_div" src="${slide.desktop.image}" alt="${slide.desktop.altText}">
        <a href="${slide.desktop.link}"></a>
      </div>
    `;
  }

  // Function to create HTML for thumbnail slide
  function createThumbnailSlide(slide) {
    return `
      <div class="thumb_slide_item">
        <div class="thumb_item_location_wrapper">
          <div class="ThumbImgTop_Pointer thumbnail_show_pin"></div>
          <p class="h5 location_title">${slide.thumbnail.title}</p>
          <img src="${slide.thumbnail.image}" alt="${slide.thumbnail.altText}" title="${slide.thumbnail.title}">
          <a href="${slide.thumbnail.link}" class="thumb_link thumb-cta-link-dynamic show-go">
            <span class="go-button">Go</span>
            <i class="fa fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;
  }

  // Call the createCarousels function
  const carouselsHTML = createCarousels(jsonArray);

  // Get carousel containers by ID
  var desktopCarouselContainer = document.getElementById('desktopCarouselContainer');
  var thumbnailCarouselContainer = document.getElementById('thumbnailCarouselContainer');

  // Check if containers exist
  if (desktopCarouselContainer && thumbnailCarouselContainer) {
    // Populate carousel containers with HTML
    desktopCarouselContainer.innerHTML = carouselsHTML.desktopCarouselHTML;
    thumbnailCarouselContainer.innerHTML = carouselsHTML.thumbnailCarouselHTML;

    console.log('Carousels populated and navigation set up successfully.');
  } else {
    console.error('Carousel containers not found.');
  }

  // Set up carousel intervals and button events
  setupCarouselInterval(desktopCarouselContainer, '.main_slide_item', 3000);
  setupCarouselInterval(thumbnailCarouselContainer, '.thumb_slide_item', 3000, true);

  setupButtonEvents(desktopCarouselContainer, '.main_slide_item');
  setupButtonEvents(thumbnailCarouselContainer, '.thumb_slide_item');

  // Function to set up button events
  function setupButtonEvents(carouselContainer, slideSelector) {
    var nextButton = document.getElementById('slide-arrow-next');
    var prevButton = document.getElementById('slide-arrow-prev');

    var desktopSlides = desktopCarouselContainer.querySelectorAll('.main_slide_item');
    var thumbSlides = thumbnailCarouselContainer.querySelectorAll('.thumb_slide_item');
    let currentActiveIndex = 0;
    let autoplayInterval;
    let isAutoplayPaused = false;

    function updateActiveSlide(index) {
      desktopSlides.forEach(slide => slide.classList.remove('active'));
      thumbSlides.forEach(slide => slide.classList.remove('active'));

      desktopSlides[index].classList.add('active');
      thumbSlides[index].classList.add('active');
    }

    function scrollToIndex(index, isThumbnail = false) {
      var container = isThumbnail ? document.getElementById('thumbnailCarouselContainer') : document.getElementById('desktopCarouselContainer');

      var slidesSelector = isThumbnail ? '.thumb_slide_item' : '.main_slide_item';
      var slides = container.querySelectorAll(slidesSelector);

      if (index >= 0 && index < slides.length) {
        var slide = slides[index];
        var scrollLeftPosition = slide.offsetLeft - container.offsetLeft;

        container.scrollTo({
          left: scrollLeftPosition,
          behavior: 'smooth'
        });
      }
    }

    function startAutoplay() {
      autoplayInterval = setInterval(function () {
        if (!isAutoplayPaused) {
          currentActiveIndex = (currentActiveIndex + 1) % desktopSlides.length;
          updateActiveSlide(currentActiveIndex);
          scrollToIndex(currentActiveIndex);
        }
      }, 3000);
    }

    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    function handleButtonClick() {
      stopAutoplay();
      updateActiveSlide(currentActiveIndex);
      scrollToIndex(currentActiveIndex);
      if (!isAutoplayPaused) {
        startAutoplay();
      }
    }

    nextButton.addEventListener('click', function () {
      currentActiveIndex = (currentActiveIndex + 1) % desktopSlides.length;
      handleButtonClick();
    });

    prevButton.addEventListener('click', function () {
      currentActiveIndex = (currentActiveIndex - 1 + desktopSlides.length) % desktopSlides.length;
      handleButtonClick();
    });

    startAutoplay();
  }

  function scrollToIndex(index, container, isThumbnail = false) {
    var slidesSelector = isThumbnail ? '.thumb_slide_item' : '.main_slide_item';
    var slides = container.querySelectorAll(slidesSelector);

    if (index >= 0 && index < slides.length) {
      var slide = slides[index];
      var scrollLeftPosition = slide.offsetLeft - container.offsetLeft;

      container.scrollTo({
        left: scrollLeftPosition,
        behavior: 'smooth'
      });
    }
  }

  function setupCarouselInterval(carouselContainer, slideSelector, interval, isThumbnail = false) {
    let currentActiveIndex = 0;
    let slides = carouselContainer.querySelectorAll(slideSelector);

    function updateActiveSlide() {
      slides.forEach(slide => slide.classList.remove('active'));
      slides[currentActiveIndex].classList.add('active');

      if (isThumbnail) {
        scrollToIndex(currentActiveIndex, carouselContainer, true);
      }

      currentActiveIndex = (currentActiveIndex + 1) % slides.length;
    }

    updateActiveSlide();

    setInterval(updateActiveSlide, interval);
  }

  // function scrollToThumbnail(slides, index, container) {
  //   const thumbSlideItem = slides[index];
  //   const thumbSlideItemRect = thumbSlideItem.getBoundingClientRect();
  //   const containerRect = container.getBoundingClientRect();

  //   const centerPosition = thumbSlideItemRect.left - containerRect.left + thumbSlideItemRect.width / 1.1;
  //   const containerCenter = containerRect.width / 1.1;
  //   let scrollLeftPosition = centerPosition - containerCenter;

  //   const maxScrollLeftPosition = thumbSlideItem.scrollWidth - thumbSlideItem.offsetWidth;
  //   scrollLeftPosition = Math.max(0, Math.min(maxScrollLeftPosition, scrollLeftPosition));

  //   scrollToIndex(index, container, true);
  // }

  function scrollToThumbnail(slides, index, container) {
    const thumbSlideItem = slides[index];
    const thumbSlideItemRect = thumbSlideItem.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
  
    const centerPosition = thumbSlideItemRect.left - containerRect.left + thumbSlideItemRect.width / 2;
    const containerCenter = containerRect.width / 2;
    let scrollLeftPosition = centerPosition - containerCenter;
  
    const maxScrollLeftPosition = container.scrollWidth - container.offsetWidth;
    scrollLeftPosition = Math.max(0, Math.min(maxScrollLeftPosition, scrollLeftPosition));
  
    container.scrollTo({
      left: scrollLeftPosition,
      behavior: 'smooth'
    });
  }

  scrollToThumbnail();
  
});
  

// document.addEventListener("DOMContentLoaded", function () {

//     var slides = document.querySelectorAll('.main_fade_slide');
//     console.log('Number of slides found:', slides.length);
  
//     var jsonArray = [];
  
//     slides.forEach(function (slide, index) {
  
//       var mainSlideItem = slide.querySelector('.main_slide_item');
//       var mainImgDiv = slide.querySelector('.main_img_div');
//       var mobileSlideItem = slide.querySelector('.mobile_slide_item');
//       var mobileImgDiv = slide.querySelector('.mobile_img_div');
//       var thumbLink = slide.querySelector('.thumb_link');
//       var thumbImg = slide.querySelector('.thumb img');
  
//       // error checking
//       if (!mainSlideItem || !mainImgDiv || !mobileSlideItem || !mobileImgDiv || !thumbLink || !thumbImg) {
//         console.error('Missing elements in slide number', index);
//         return;
//       }
  
//       var jsonObj = {
//         desktop: {
//           link: mainSlideItem.getAttribute('data-link'),
//           backgroundImage: mainSlideItem.style.backgroundImage.slice(5, -2).replace(/"/g, ""),
//           image: mainImgDiv.src,
//           altText: mainImgDiv.alt
//         },
//         mobile: {
//           link: mobileSlideItem.getAttribute('data-link'),
//           backgroundImage: mobileSlideItem.style.backgroundImage.slice(5, -2).replace(/"/g, ""),
//           image: mobileImgDiv.src,
//           altText: mobileImgDiv.alt
//         },
//         thumbnail: {
//           link: thumbLink.getAttribute('href'),
//           image: thumbImg.src,
//           altText: thumbImg.alt,
//           title: thumbImg.title
//         }
//       };
//       jsonArray.push(jsonObj);
//     });
  
//     if (jsonArray.length === 0) {
//       console.error('No slides were added to the array. Check the class names and HTML structure.');
//       return;
//     }
  
//     function createCarousels(slidesArray) {
  
//       const createDesktopSlide = (slide) => `
//         <div class="main_slide_item" style="background-image: url('${slide.desktop.backgroundImage}');">
//           <img class="main_img_div" src="${slide.desktop.image}" alt="${slide.desktop.altText}">
//           <a href="${slide.desktop.link}"></a>
//         </div>
//       `;
  
//       const createThumbnailSlide = (slide) => `
//         <div class="thumb_slide_item">
//           <div class="thumb_item_location_wrapper">
//             <div class="ThumbImgTop_Pointer thumbnail_show_pin"></div>
//             <p class="h5 location_title">${slide.thumbnail.title}</p>
//             <img src="${slide.thumbnail.image}" alt="${slide.thumbnail.altText}" title="${slide.thumbnail.title}">
    
//             <a href="${slide.thumbnail.link}" class="thumb_link thumb-cta-link-dynamic show-go">
//               <span class="go-button">Go</span>
//               <i class="fa fa-arrow-right"></i>
//             </a>
//           </div>
//         </div>
//       `;
  
//       let desktopCarouselHTML = '<div class="desktop_carousel">';
//       let thumbnailCarouselHTML = '<div class="thumbnail_carousel">';
  
//       slidesArray.forEach((slide) => {
//         desktopCarouselHTML += createDesktopSlide(slide);
//         thumbnailCarouselHTML += createThumbnailSlide(slide);
//       });
  
//       desktopCarouselHTML += '</div>';
//       thumbnailCarouselHTML += '</div>';
  
//       return {
//         desktopCarouselHTML,
//         thumbnailCarouselHTML
//       };
//     }
  
//     const carouselsHTML = createCarousels(jsonArray);
  
//     var desktopCarouselContainer = document.getElementById('desktopCarouselContainer');
//     var thumbnailCarouselContainer = document.getElementById('thumbnailCarouselContainer');
  
//     if (desktopCarouselContainer && thumbnailCarouselContainer) {
//       desktopCarouselContainer.innerHTML = carouselsHTML.desktopCarouselHTML;
//       thumbnailCarouselContainer.innerHTML = carouselsHTML.thumbnailCarouselHTML;
  
//       console.log('Carousels populated and navigation set up successfully.');
//     } else {
//       console.error('Carousel containers not found.');
//     }
  
//     setupCarouselInterval(desktopCarouselContainer, '.main_slide_item', 3000);
//     setupCarouselInterval(thumbnailCarouselContainer, '.thumb_slide_item', 3000, true);
  
//     setupButtonEvents(desktopCarouselContainer, '.main_slide_item');
//     setupButtonEvents(thumbnailCarouselContainer, '.thumb_slide_item');
  
//   // setupButtons v4
//   function setupButtonEvents(carouselContainer, slideSelector) {
//     var nextButton = document.getElementById('slide-arrow-next');
//     var prevButton = document.getElementById('slide-arrow-prev');
  
//     var desktopSlides = desktopCarouselContainer.querySelectorAll('.main_slide_item');
//     var thumbSlides = thumbnailCarouselContainer.querySelectorAll('.thumb_slide_item');
//     let currentActiveIndex = 0;
//     let autoplayInterval;
//     let isAutoplayPaused = false;
  
//     function updateActiveSlide(index) {
//       desktopSlides.forEach(slide => slide.classList.remove('active'));
//       thumbSlides.forEach(slide => slide.classList.remove('active'));
  
//       desktopSlides[index].classList.add('active');
//       thumbSlides[index].classList.add('active');
//     }

//     function scrollToIndex(index, isThumbnail = false) {
//       // Determine the appropriate container based on the carousel type
//       var container = isThumbnail ? document.getElementById('thumbnailCarouselContainer') : document.getElementById('desktopCarouselContainer');
    
//       var slidesSelector = isThumbnail ? '.thumb_slide_item' : '.main_slide_item';
//       var slides = container.querySelectorAll(slidesSelector);
    
//       if (index >= 0 && index < slides.length) {
//         var slide = slides[index];
//         var scrollLeftPosition = slide.offsetLeft - container.offsetLeft;
    
//         container.scrollTo({
//           left: scrollLeftPosition,
//           behavior: 'smooth'
//         });
//       }
//     }
    
  
//     function startAutoplay() {
//       autoplayInterval = setInterval(function () {
//         if (!isAutoplayPaused) {
//           currentActiveIndex = (currentActiveIndex + 1) % desktopSlides.length;
//           updateActiveSlide(currentActiveIndex);
//           scrollToIndex(currentActiveIndex); // Add this line to scroll to the selected index
//         }
//       }, 3000); // Adjust the interval as needed
//     }
  
//     function stopAutoplay() {
//       clearInterval(autoplayInterval);
//     }
  
//     function handleButtonClick() {
//       // Stop autoplay when a button is clicked
//       stopAutoplay();
//       // Update the active slide without changing the index
//       updateActiveSlide(currentActiveIndex);
//       scrollToIndex(currentActiveIndex); // Add this line to scroll to the selected index
//       // Start autoplay again if it wasn't paused
//       if (!isAutoplayPaused) {
//         startAutoplay();
//       }
//     }
  
//     nextButton.addEventListener('click', function () {
//       currentActiveIndex = (currentActiveIndex + 1) % desktopSlides.length;
//       handleButtonClick();
//     });
  
//     prevButton.addEventListener('click', function () {
//       currentActiveIndex = (currentActiveIndex - 1 + desktopSlides.length) % desktopSlides.length;
//       handleButtonClick();
//     });
  
//     // Start autoplay initially
//     startAutoplay();
//   }
  
  
  
//     function setupCarouselInterval(carouselContainer, slideSelector, interval, isThumbnail = false) {
//       let currentActiveIndex = 0;
//       let slides = carouselContainer.querySelectorAll(slideSelector);
  
//       function updateActiveSlide() {
//         slides.forEach(slide => slide.classList.remove('active'));
//         slides[currentActiveIndex].classList.add('active');
  
//         if (isThumbnail) {
//           scrollToThumbnail(slides, currentActiveIndex, carouselContainer);
//         }
  
//         currentActiveIndex = (currentActiveIndex + 1) % slides.length;
//       }
  
  
  
//       updateActiveSlide();
  
//       setInterval(updateActiveSlide, interval);
//     }
  
    
//     function scrollToThumbnail(slides, index, container) {
//     // const thumbSlideItem = slides[index]
//     const thumbSlideItem = slides[index];
//     console.log(thumbSlideItem);
//     const thumbSlideItemRect = thumbSlideItem.getBoundingClientRect();
//     const containerRect = container.getBoundingClientRect();
  
//     const centerPosition = thumbSlideItemRect.left - containerRect.left + thumbSlideItemRect.width / 1.1;
//     const containerCenter = containerRect.width / 1.1;
//     let scrollLeftPosition = centerPosition - containerCenter;
  
//     const maxScrollLeftPosition = thumbSlideItem.scrollWidth - thumbSlideItem.offsetWidth;
//     scrollLeftPosition = Math.max(0, Math.min(maxScrollLeftPosition, scrollLeftPosition));
  
//     // // const scrollCarousel = document.querySelector(".thumb_slide_item");
//     // thumbSlideItem.scrollIntoViewOptions({
//     //   alignToTop: false,
//     //   left: scrollLeftPosition,
//     //   inline: 'nearest',
//     //   behavior: 'smooth'
//     // });

    
//   }
  
//   });