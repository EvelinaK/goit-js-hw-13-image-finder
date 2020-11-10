const baseUrl = 'https://pixabay.com/api/';

export default {
  page: 1,
  query: '',
  key: '18964408-9430149bbed18e9d9e56d5420',
  fetchGallery() {
    const requestParams = `?image_type=photo&orientation=horizontal&q=${this.query}&page=${this.page}&per_page=12&key=${this.key}`;
    return fetch(baseUrl + requestParams)
      .then(res => res.json())
      .then(({ hits }) => {
        this.incrementPage();
        return hits;
      });
  },
  get SearchQuery() {
    return this.query;
  },
  set SearchQuery(string) {
    return (this.query = string);
  },

  incrementPage() {
    this.page += 1;
  },
  resetPage() {
    this.page = 1;
  },
};
