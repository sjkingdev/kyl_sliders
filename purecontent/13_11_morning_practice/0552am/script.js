document.addEventListener('DOMContentLoaded', function () {
    // Step 1: Access the HTML content
    const section = document.querySelector('.purecontent');
    const mainSlides = section.querySelectorAll('.main_fade_slide');
  
    // Step 2: Create the main slide and thumbnail carousel using template literals
    let mainCarouselHTML = '';
    let thumbnailCarouselHTML = '';
  
    mainSlides.forEach((mainSlide, index) => {
      const mainSlideItem = mainSlide.querySelector('.main_slide_item');
      const thumbSlide = mainSlide.querySelector('.hidden_thumb_slide');
      const bannerImg = mainSlideItem.querySelector('.main_img_div'); 
  
      const mainImageURL = mainSlideItem.style.backgroundImage
        .replace('url(', '')
        .replace(')', '')
        .replace(/\"/gi, '');

      const bannerImageURL = bannerImg.src; 
      const mainLink = mainSlideItem.getAttribute('data-link');
      const thumbImageURL = thumbSlide.querySelector('img').src;
      const thumbLink = thumbSlide.querySelector('.thumb_link').getAttribute('data-link');
      const thumbTitle = thumbSlide.querySelector('img').getAttribute('title');

    
  
      mainCarouselHTML += `
        <div class="main_slide_item" data-link="${mainLink}" style="background-image:url(${mainImageURL});">
          <img class="main_img_div" src="${bannerImageURL}" alt="Location banner">
          <a href="${mainLink}"></a>
        </div>
      `;
  
      thumbnailCarouselHTML += `
        <div class="thumb_slide_item">
        <div class="map_pin show-pin">&#9906;</div>
          <p class="h4 location_title">${thumbTitle} </p>
          <img src="${thumbImageURL}" alt="Location Thumbnail" title="Thumbnail">
          <a class="thumb_link" href="${thumbLink}" data-link="${thumbLink}"><span>Go</span><span class="go-arrow-right">&xrarr;</span></a>
        </div>
      `;
    });
  
    // Combine main carousel slide and thumbnail carousel slide HTML
    const mainCarouselInner = document.querySelector('.main_carousel_inner');
    const thumbnailCarouselInner = document.querySelector('.thumb_carousel_inner');
  
    mainCarouselInner.innerHTML = mainCarouselHTML;
    thumbnailCarouselInner.innerHTML = thumbnailCarouselHTML;
  });
//   