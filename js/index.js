const mainContent = document.querySelector('#mainContent');
const pagination = document.querySelector('.pagination');
const modal = document.querySelector('.modal');
const searchForm = document.querySelector('.search');
const state = { //page global state
  currentPage:1,
  photos:[]
};
fetchPics('nature');
function fetchPics(searchWord) {
  const link = `https://api.flickr.com/services/rest/?method=flickr.photos.search&tags=${searchWord}&api_key=c48c0eee6d23486475bd28a5cf3d1e43&format=json&nojsoncallback=?`;
  mainContent.innerHTML = `<div class="loader"></div>`;
  fetch(link)
    .then(
      function(response) {
        if (response.status !== 200) {
          mainContent.innerHTML= 'Looks like there was a problem. Status Code: ' + response.status;
          return;
        }

        response.json().then(function(data) {
          pagination.classList.remove('hidden');
          state.photos = data.photos.photo;
          state.currentPage = 1;
          console.log(state.photos);
          mainContent.innerHTML = generatePicturesContainer(state.photos.slice(0, 10));
          renderPagination();
        });
      }
    )
    .catch(function(err) {
      mainContent.innerHTML = 'Fetch Error :-S' + err.message;
    });
}
/*Search listener*/
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  fetchPics(e.target.search.value);
})
/*Helper Functions*/
function generatePicturesList(photosArr){
  return photosArr.reduce((acc, photo) =>
  `${acc}
  <div class="imgContainer">
    <img
      onclick='viewModal("https://c1.staticflickr.com/${photo.farm}/${photo.server}/${photo.id}_${photo.secret}_c.jpg")'
      src="https://c1.staticflickr.com/${photo.farm}/${photo.server}/${photo.id}_${photo.secret}.jpg"
      alt="Flickr image"
      >
  </div>`
  ,'');
}
function generatePicturesContainer(photosArr) {
  return `
    <div class="picsCol">
      ${generatePicturesList(photosArr.slice(0,photosArr.length/3))}
    </div>
    <div class="picsCol">
      ${generatePicturesList(photosArr.slice(photosArr.length/3,photosArr.length*2/3))}
    </div>
    <div class="picsCol">
      ${generatePicturesList(photosArr.slice(photosArr.length*2/3,photosArr.length))}
    </div>
    `
}
function goToPage(num) {
  console.log(state.photos.length);
  if (num >0 && (num)*10 <= state.photos.length+1) {
    console.log('ww');
    state.currentPage = num;
    mainContent.innerHTML = generatePicturesContainer(state.photos.slice((num-1)*10, num*10));
    renderPagination();
  }
}
function renderPagination() {
  const { currentPage, photos } = state;
  const numberOfPages = Math.ceil(photos.length/10);
  let content = `<a onclick="goToPage(${currentPage-1})" class="pageNum prev"><</a>`;
  if (numberOfPages > 3) {
    if (currentPage ==1)
      content +=`
        <a onclick="goToPage(1)" class="pageNum active">1</a>
        <a onclick="goToPage(2)" class="pageNum">2</a>
        <a onclick="goToPage(3)" class="pageNum">3</a>
      `;
    else if (currentPage === numberOfPages)
      content +=`
        <a onclick="goToPage(${currentPage-2})" class="pageNum">${currentPage-2}</a>
        <a onclick="goToPage(${currentPage-1})" class="pageNum">${currentPage-1}</a>
        <a onclick="goToPage(${currentPage})" class="pageNum active">${currentPage}</a>
      `;
    else
    content += `
      <a onclick="goToPage(${currentPage-1})" class="pageNum">${currentPage-1}</a>
      <a onclick="goToPage(${currentPage})" class="pageNum active">${currentPage}</a>
      <a onclick="goToPage(${currentPage+1})" class="pageNum">${currentPage+1}</a>
      `
  }else{
    for (var i = 1; i <= numberOfPages; i++) {
      content += `<a onclick="goToPage(${i})" class="pageNum ${currentPage === i? 'active':''}">${i}</a>`
    }
  }
  content +=`<a onclick="goToPage(${currentPage+1})" class="pageNum next">></a>`;
  pagination.innerHTML = content;
}

function viewModal(link) {
  document.querySelector('.modal .modalContent').innerHTML = `<img src="${link}" alt="Flickr image">`;
  modal.classList.remove('hidden');
}
if (modal) {
  modal.addEventListener('click', (e) => {
    modal.classList.add('hidden');
  })
  document.querySelector('.modal .modalContent').addEventListener('click',(e) => {
    e.stopPropagation();
  })
}
