import { BASE_URL, getPhoto, itemPerPage } from './api/webApi'
import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

console.log(BASE_URL);
const galleryEl = document.querySelector('.gallery');
const formEl = document.querySelector('#search-form');
const moreBtn = document.querySelector('.load-more')

let page = 1;
const totalPages = Math.ceil(500 / itemPerPage);

formEl.addEventListener('submit', onSubmit);


async function loadMorePhoto(searchValue) { 
    page += 1;
    const data = await getPhoto(searchValue, page);
    data.hits.forEach(photo => {
        createCardMurkup(photo);
    });
    if (page === totalPages) {
        moreBtn.classList.add('visually-hidden');
    }

};

function onSubmit(event) {
    event.preventDefault();
    removeMarkup(galleryEl);

    const searchValue = event.currentTarget[0].value;
    mountData(searchValue);
}

mountData();

async function mountData(searchValue) {
    try {
        const data = await getPhoto(searchValue, page);
        moreBtn.classList.remove('visually-hidden');
        moreBtn.addEventListener('click', () => {loadMorePhoto(searchValue)} );
        if (data.hits.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        };
      data.hits.forEach(photo => {
          createCardMurkup(photo);
      });
    }catch (error) {
        console.log(error);
    };
};

function createCardMurkup({ webformatURL, largeImageURL, tags, likes, views, comments, downloads}) {
    galleryEl.insertAdjacentHTML('beforeend', `<div class="photo-card">
  <img src=${webformatURL} alt=${tags} loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: </b><span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views: </b><span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments: </b><span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads: </b><span>${downloads}</span>
    </p>
  </div>
</div>`);
};

function removeMarkup(element) {
    element.innerHTML = '';
};
