import { BASE_URL, getPhoto, itemPerPage } from './api/webApi'
import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

console.log(BASE_URL);
const galleryEl = document.querySelector('.gallery');
const formEl = document.querySelector('#search-form');
const moreBtn = document.querySelector('.load-more')

let page = 1;
let searchValue = '';
const totalPages = Math.ceil(500 / itemPerPage);
let lightbox = new SimpleLightbox('.photo-card a', { captionDelay: 300 });

formEl.addEventListener('submit', onSubmit);

async function loadMorePhoto() {
  page += 1;
  const data = await getPhoto(searchValue, page);
  createGalleryMarkup(data.hits);

  if (page === totalPages) {
    addClass('visually-hidden');
  };
}

  async function mountData(searchValue) {
    try {
      const data = await getPhoto(searchValue, page);
      
      removeClass('visually-hidden') 
      moreBtn.addEventListener('click', loadMorePhoto);
      
      if (data.hits.length === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      } else {
        Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      }
      
      createGalleryMarkup(data.hits);
       
    
    } catch (error) {
      addClass('visually-hidden');
      Notiflix.Notify.failure('Ooops, Error!');
    };
};


function createGalleryMarkup(cardsArr) {
  const markUp = cardsArr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `<div class="photo-card">
  <a class="link-img photo-card" href=${largeImageURL}><img class="card-img" src=${webformatURL} alt=${tags} loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b class="info-item-label">Likes: </b><span class="info-item-span">${likes}</span>
    </p>
    <p class="info-item">
      <b class="info-item-label">Views: </b><span class="info-item-span">${views}</span>
    </p>
    <p class="info-item">
      <b class="info-item-label">Comments: </b><span class="info-item-span">${comments}</span>
    </p>
    <p class="info-item">
      <b class="info-item-label">Downloads: </b><span class="info-item-span">${downloads}</span>
    </p>
  </div>
</div>`).join('');
  
  galleryEl.insertAdjacentHTML('beforeend', markUp);
  lightbox.refresh();
}

   function onSubmit (event) {
    event.preventDefault();
     removeMarkup(galleryEl);
     
     searchValue = event.currentTarget.elements.searchQuery.value;
     console.dir(searchValue);

     if (!searchValue.trim()) {
            Notiflix.Notify.failure('Write something.');
            return;
     }
     mountData(searchValue);
}

function removeMarkup(element) {
    element.innerHTML = '';
};

function addClass(className) {
  moreBtn.classList.add(className);
}
function removeClass(className) {
  moreBtn.classList.remove(className);
}
