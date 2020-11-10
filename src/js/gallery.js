import service from '../services/gallery-Service';
import cardTemplate from '../templates/card.hbs';
import * as basicLightbox from 'basiclightbox';
import * as InfiniteScroll from 'infinite-scroll';
////////-----------------ссылки на элементы--------------------------------------/////////
const refs = {
  $searchForm: document.querySelector('#search-form'),
  $galleryCont: document.querySelector('#galleryCont'),
  $loadMorebutton: document.querySelector('button[data-action="load-more"]'),
  $galleryList: document.querySelector('.gallery'),
  $ldsHeart: document.querySelector('.lds-heart'),
};
////////-----------------обработчики события --------------------------------------/////////
refs.$searchForm.addEventListener('submit', searchformSubmitHandler);
refs.$loadMorebutton.addEventListener('click', loadMorebuttonHandler);
refs.$galleryList.addEventListener('click', openModalImg);

////////-----------------поиск картинок в форме--------------------------------------/////////
function searchformSubmitHandler(e) {
  e.preventDefault();
  if (this.query.value === service.SearchQuery) {
    return;
  }
  const form = e.currentTarget;
  const input = form.elements.query;
  clearCountries();
  service.resetPage();

  service.SearchQuery = input.value;
  toggleLoader();

  service
    .fetchGallery()
    .then(gallery => {
      updateGalleryList(gallery);
    })
    .catch(error => {
      console.warn(error);
    })
    .finally(() => {
      toggleLoader();
    });

  input.value = '';
}
////////-----------------подгрузка дополнительных картинок--------------------------------------/////////
function loadMorebuttonHandler() {
  toggleLoader();
  service
    .fetchGallery()
    .then(hits => {
      updateGalleryList(hits);
      setTimeout(() => {
        window.scrollTo({
          bottom: 0,
          behavior: 'smooth',
        });
      }, 1000);
    })
    .catch(error => {
      console.warn(error);
    })
    .finally(() => {
      toggleLoader();
    });
}
////////-----------------модкальное окно на клик--------------------------------------------/////////
function openModalImg({ target }) {
  if (target.nodeName !== 'IMG') {
    return;
  }
  const largeImgURL = target.dataset.source;

  const instance = basicLightbox.create(`
  <img src="${largeImgURL}" width="800" height="600">
`);
  instance.show();
  //createModal(largeImgURL);--------функция для отрисовки картинок отдельная (вызов )-------/////////
}
////////-----------------библиотека для модального окна--------------------------------------/////////
// function createModal(img) {
//   const instance = basicLightbox.create(`
//   <img src="${img}" width="800" height="600">
// `);
//   instance.show();
// }
////////-----------------отрисовка карточек галереи на странице -----------------------------/////////
function updateGalleryList(items) {
  const markup = cardTemplate(items);
  refs.$galleryCont.insertAdjacentHTML('beforeend', markup);
}
////////-----------------очистка галереи после поиска картинок------------------------------/////////

const clearCountries = () => {
  refs.$galleryCont.innerHTML = '';
};
////////-----------------loader для галереи------------------------------/////////
const toggleLoader = () => {
  console.log('лоадер');
  refs.$ldsHeart.classList.toggle('loaded');
};

//////-----------------бесконечный скролл------------------------------/////////
// infScroll;
const PIXABAY_API_KEY = '18874263-8f02838ab97d9dd90f7110125';

const API_URL = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}`;

var elem = document.querySelector('#galleryCont');
const options = {
  path: function () {
    return `${API_URL}&q=${encodeURIComponent('cat')}&page=${
      this.pageIndex
    }&per_page=12&image_type=photo&orientation=horizontal`;
  },
  append: '.cards',
  history: false,
};
//var infScroll2 = new InfiniteScroll(elem, options);
var infScroll = new InfiniteScroll('#galleryCont', options);
// element argument can be a selector string
//   for an individual element
// var infScroll = new InfiniteScroll('.container', {
//   // options
// });

// function getPenPath() {
//   var slug = nextPenSlugs[ this.loadCount ];
//   return 'https://s.codepen.io/desandro/debug/' + slug;
// }
// jQueryBridget( 'infiniteScroll', InfiniteScroll, $ );
// const PIXABAY_API_KEY = '18874263-8f02838ab97d9dd90f7110125';

// const API_URL = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}`;

// //const url = `${API_URL}&q=${encodeURIComponent(this.qStr)}&page=${this.pageIndex}&per_page=12&image_type=photo&orientation=horizontal`

// const $gallery = document.querySelector('.gallery').infiniteScroll({
//     path: function() {
//       return `${API_URL}&q=${encodeURIComponent('cat')}&page=${this.pageIndex}&per_page=12&image_type=photo&orientation=horizontal`
//     },
//     // load response as flat text
//     responseType: 'text',
//     status: '.scroll-status',
//     history: false,
//   });

//   $gallery.addEventListener( 'load.infiniteScroll', function(event, response ) {
//     console.log( response )
//     // parse response into JSON data
//     const data = JSON.parse( response );
//     // compile data into HTML
//     const itemsHTML = cardTmpl(data.hits);
//     // convert HTML string into elements
//     const $items = document.querySelector( itemsHTML );
//     // append item elements
//     $items.imagesLoaded( function() {
//       $gallery.infiniteScroll( 'appendItems', $items )
//     })
//   });

//   // load initial page
//   $gallery.infiniteScroll('loadNextPage');

//   //------------------//

// © 2020 GitHub, Inc.
// Terms
// Privacy
// Security
// Status
// Help
// Contact GitHub
// Pricing
// API
// Training
// Blog
// About
