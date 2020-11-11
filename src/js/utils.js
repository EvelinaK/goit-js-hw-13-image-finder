import InfiniteScroll from 'infinite-scroll';
import cardTemplate from '../templates/card.hbs';
import service from '../services/gallery-Service';
import * as basicLightbox from 'basiclightbox';
// import { clearCountries } from './gallery';
import ImagesApiService from '../services/gallery-Service';
const apiService = new ImagesApiService();
const refs = {
  $searchForm: document.querySelector('#search-form'),
  $galleryCont: document.querySelector('#galleryCont'),
  $loadMorebutton: document.querySelector('button[data-action="load-more"]'),
  $galleryList: document.querySelector('.gallery'),
  $ldsHeart: document.querySelector('.lds-heart'),
};
////////-----------------обработчики события --------------------------------------/////////
refs.$searchForm.addEventListener('submit', searchformSubmitHandler);
// refs.$loadMorebutton.addEventListener('click', loadMorebuttonHandler);
refs.$galleryList.addEventListener('click', openModalImg);

function searchformSubmitHandler(e) {
  e.preventDefault();
  if (this.query.value === apiService.SearchQuery) {
    return;
  }

  const form = e.currentTarget;
  const input = form.elements.query;
  clearCountries();
  apiService.resetPage();

  apiService.SearchQuery = input.value;

  toggleLoader();
  infScroll.loadNextPage();
}
function openModalImg({ target }) {
  if (target.nodeName !== 'IMG') {
    return;
  }
  const largeImgURL = target.dataset.source;

  const instance = basicLightbox.create(`
    <img src="${largeImgURL}" width="800" height="600">
  `);
  instance.show();
}

const toggleLoader = () => {
  console.log('лоадер');
  refs.$ldsHeart.classList.toggle('loaded');
};

const clearCountries = () => {
  refs.$galleryCont.innerHTML = '';
};

const infScroll = new InfiniteScroll('#galleryCont', {
  path() {
    return apiService.getQueryPath();
  },
  //   path: function () {
  //     return `${CORS}${baseUrl}?image_type=photo&orientation=horizontal&q=${query}&page=${this.pageIndex}&per_page=12&key=${key}`;
  //   },
  responseType: 'text',
  status: '.scroll-status',
  history: false,
});

var proxyElem = document.createElement('div');
infScroll.on('load', function (response) {
  var { hits } = JSON.parse(response);
  var itemsHTML = cardTemplate(hits);
  proxyElem.innerHTML = itemsHTML;
  var items = proxyElem.querySelectorAll('li.cards');
  infScroll.appendItems(items);
});

// infScroll.loadNextPage();
