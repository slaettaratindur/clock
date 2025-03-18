/**
 * Main script
 */

/**
 * Create structure to display image
 *
 * @param {string} url URL of image to display
 * @param {Object} loader HTML element: loader to remove, if needed
 */
const createImage = (url, loader) => {
  const img = document.createElement('img');
  img.src = url;
  img.classList.add('image');
  img.style.visibility = 'hidden';
  img.style.opacity = 0;
  img.onload = () => {
    if (loader) {
      container.removeChild(loader);
    }
    img.style.visibility = 'visible';
    img.style.opacity = 1;
  };

  const container = document.getElementById('imageContainer');
  container.appendChild(img);
};

/**
 * Update image src
 *
 * @param {string} url New url
 */
const updateImage = (url) => {
  const container = document.getElementById('imageContainer');
  const oldImg = container.children[0];

  const newImg = document.createElement('img');
  newImg.src = url;
  newImg.classList.add('image');
  newImg.style['max-height'] = 0;
  newImg.style.visibility = 'hidden';
  newImg.style.opacity = 0;

  newImg.onload = () => {
    oldImg.style.opacity = 0;

    setTimeout(() => {
      container.removeChild(oldImg);
      newImg.style['max-height'] = '100%';
      newImg.style.visibility = 'visible';
      newImg.style.opacity = 1;
    }, 1000);
  };

  container.appendChild(newImg);
};

/**
 * Update file link
 *
 * @param {string} filename New file name
 */
const updateFileLink = (filename) => {
  const filenameSpan = document.getElementById('filename');
  filenameSpan.innerHTML = `<a href="https://commons.wikimedia.org/wiki/${filename}">${filename}</a>`;
};

/**
 * Update user link
 *
 * @param {string} user New user name
 */
const updateUserLink = (user) => {
  const userSpan = document.getElementById('user');
  userSpan.innerHTML = `<a href="https://commons.wikimedia.org/wiki/User:${user}">User:${user}</a>`;
};

/**
 * Display an image
 *
 * @param {Object} imageInfos 
 */
const displayImage = async (imageInfos) => {
  const loader = document.getElementById('loader');

  if (loader) {
    createImage(imageInfos.url, loader);
    document.getElementById('infoContainer').classList.remove('hidden');
  } else {
    updateImage(imageInfos.url);
  }

  updateFileLink(imageInfos.name);
  updateUserLink(imageInfos.user);
};

/**
 * Load a new image.
 * 
 * Fired every minute.
 */
const loadNewImage = async () => {
  const localTime = getLocalTime();
  const imageTitles = await getCategoryFiles(`Time ${localTime}`);
  const randomImageTitle = imageTitles[Math.floor((Math.random() * imageTitles.length))];
  const imageInfos = await getImageInfos(randomImageTitle);

  displayImage(imageInfos);
};

/**
 * Main function
 */
const process = async () => {
  await loadNewImage();

  repeatFunction(loadNewImage);
};

document.addEventListener('DOMContentLoaded', () => {
  process();
});
