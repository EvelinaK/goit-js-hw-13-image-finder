// Get an API key for your demos at https://unsplash.com/developers

var unsplashID =
  '9ad80b14098bcead9c7de952435e937cc3723ae61084ba8e729adb642daf0251';

var infScroll = new InfiniteScroll('.container', {
  path: function () {
    return (
      'https://api.unsplash.com/photos?client_id=' +
      unsplashID +
      '&page=' +
      this.pageIndex
    );
  },
  // load response as flat text
  responseType: 'text',
  status: '.scroll-status',
  history: false,
});

// use element to turn HTML string into elements
var proxyElem = document.createElement('div');

infScroll.on('load', function (response) {
  // parse response into JSON data
  var data = JSON.parse(response);
  // compile data into HTML
  var itemsHTML = data.map(getItemHTML).join('');
  // convert HTML string into elements
  proxyElem.innerHTML = itemsHTML;
  // append item elements
  var items = proxyElem.querySelectorAll('.photo-item');
  infScroll.appendItems(items);
});

// load initial page
infScroll.loadNextPage();

//------------------//

var itemTemplateSrc = document.querySelector('#photo-item-template').innerHTML;

function getItemHTML(photo) {
  return microTemplate(itemTemplateSrc, photo);
}

// micro templating, sort-of
function microTemplate(src, data) {
  // replace {{tags}} in source
  return src.replace(/\{\{([\w\-_\.]+)\}\}/gi, function (match, key) {
    // walk through objects to get value
    var value = data;
    key.split('.').forEach(function (part) {
      value = value[part];
    });
    return value;
  });
}
