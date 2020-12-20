import InfiniteScroll from 'infinite-scroll';
import cardTemplate from '../templates/card.hbs';
import { error, success } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { refs } from './refs.js';
import { clearCountries } from './gallery';
import { toggleLoader } from './gallery';
import { openModalImg } from './modal';
import ImagesApiService from '../services/gallery-Service';

const apiService = new ImagesApiService();

////////-----------------обработчики события --------------------------------------/////////
refs.$searchForm.addEventListener('submit', searchformSubmitHandler);
// refs.$loadMorebutton.addEventListener('click', loadMorebuttonHandler);
refs.$galleryList.addEventListener('click', openModalImg);
////////-----------------поиск картинок в форме--------------------------------------/////////
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
////////-----------------бесконечный скролл--------------------------------------/////////
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

let proxyElem = document.createElement('div');
infScroll.on('load', function (response) {
  let { hits } = JSON.parse(response);
  console.log(hits);

  if (hits.length === 0) {
    error({
      title: 'Bad search request!',
      delay: 3000,
      mouseReset: true,
      closerHover: false,
    });
    toggleLoader();
    return;
  }
  if (hits.length > 1) {
    success({
      title: 'success request!',
      delay: 1000,
      mouseReset: true,
      destroy: true,
    });
  }
  apiService.incrementPage();
  let itemsHTML = cardTemplate(hits);

  proxyElem.innerHTML = itemsHTML;

  let items = proxyElem.querySelectorAll('li.cards');
  infScroll.appendItems(items);
});

// infScroll.loadNextPage();
