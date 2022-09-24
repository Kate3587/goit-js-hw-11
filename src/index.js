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
const totalPages = Math.ceil(500 / itemPerPage);

formEl.addEventListener('submit', onSubmit);



async function loadMorePhoto(searchValue) {
  page += 1;
  const data = await getPhoto(searchValue, page);
  createGalleryMarkup(data.hits);
  // data.hits.forEach(photo => {
  //   createCardMurkup(photo);
  // });
  if (page === totalPages) {
    addClass('visually-hidden');
  };
}
  async function mountData(searchValue) {
    try {
      const data = await getPhoto(searchValue, page);
      removeClass('visually-hidden');
      
      const moreBtnCallback = () => {
        loadMorePhoto(searchValue)
      }
      
      moreBtn.removeEventListener('click', moreBtnCallback);
      
      moreBtn.addEventListener('click', moreBtnCallback);

      if (data.hits.length === 0) {
        addClass('visually-hidden');
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      } else 
        Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
       
        createGalleryMarkup(data.hits);
        // data.hits.forEach(photo => {
        //   createCardMurkup(photo);
        // });
        createLightbox();
    } catch (error) {
      addClass('visually-hidden');
      console.log(error);
    };
  };
function createGalleryMarkup(cardsArr) {
  const markUp = cardsArr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `<div class="photo-card">
  <a class="link-img" href=${largeImageURL}><img class="card-img" src=${webformatURL} alt=${tags} loading="lazy" /></a>
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
}



// function createCardMurkup({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
//     galleryEl.insertAdjacentHTML('beforeend', `<div class="photo-card">
//   <a class="link-img" href=${largeImageURL}><img class="card-img" src=${webformatURL} alt=${tags} loading="lazy" /></a>
//   <div class="info">
//     <p class="info-item">
//       <b class="info-item-label">Likes: </b><span class="info-item-span">${likes}</span>
//     </p>
//     <p class="info-item">
//       <b class="info-item-label">Views: </b><span class="info-item-span">${views}</span>
//     </p>
//     <p class="info-item">
//       <b class="info-item-label">Comments: </b><span class="info-item-span">${comments}</span>
//     </p>
//     <p class="info-item">
//       <b class="info-item-label">Downloads: </b><span class="info-item-span">${downloads}</span>
//     </p>
//   </div>
// </div>`);
//   };

   function onSubmit (event) {
    event.preventDefault();
    removeMarkup(galleryEl);

    const searchValue = event.currentTarget[0].value;
    mountData(searchValue);
}

  function createLightbox() {
    const linkImg = document.querySelector('.link-img');
    linkImg.addEventListener('click', openModal);

    function openModal(event) {
      event.preventDefault();
    }

    let lightbox = new SimpleLightbox('.photo-card a', { captionDelay: 300 })
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
