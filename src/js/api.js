/**
 * API access
 */

/**
 * Format URL for Wikimedia Commons:
 *   - Add 'json' format parameter
 *   - Use base URL
 *
 * @param {Object} params url parameters
 * @returns {string} formatted url
 */
const formatUrl = (params) => {
  if (!params.format) {
    params.format = 'json';
  }

  return `${URL_BASE}?${Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&')}`;
}

/**
 * Query Wikimedia Commons API
 *
 * @param {Object} params Query parameters
 * @returns {Object} Content of 'query' field of response
 */
const queryCommons = (params) => new Promise((resolve, reject) => {
  const url = formatUrl(params);

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      resolve(data.query);
    })
    .catch((error) => {
      reject();
    });
});

/**
 * Get titles of all jpg/png image files in a given category.
 *
 * @param {string} category Category name
 * @returns {string[]} Titles of image files
 */
const getCategoryFiles = (category) => new Promise((resolve, reject) => {  
  const urlParams = {
    action: 'query',
    cmlimit: 500,
    cmprop: 'title',
    cmtitle: `Category:${category}`,
    cmtype: 'file',
    list: 'categorymembers',
  };

  queryCommons(urlParams)
    .then((query) => {
      resolve(query.categorymembers
        .map(item => item.title)
        .filter(item => {
          const extension = item.replaceAll(/^.*\.([^\.]+)$/g, '$1').toLowerCase();

          return ['jpg', 'jpeg', 'png'].includes(extension);
        }));
    })
    .catch((error) => {
      console.error(error);
      reject();
    });
});

/**
 * Get infos about an image :
 *   - thumbnail url
 *   - Uploader name
 *   - File name
 * @param {string} image Image to query
 * @returns {Object} infos (url / uploader / name)
 */
const getImageInfos = (image) => new Promise((resolve, reject) => {
  const urlParams = {
    action: 'query',
    titles: image,
    prop: 'imageinfo',
    iiprop: 'url|user',
    iiurlwidth: IMAGE_WIDTH
  };

  queryCommons(urlParams)
    .then((query) => {
      const imageId = Object.keys(query.pages)[0];
      const item = query.pages[imageId].imageinfo[0];

      resolve({
        height: item.thumbheight,
        name: image,
        url: item.thumburl,
        user: item.user,
        width: item.thumbwidth,
      });
    })
    .catch((error) => {
      console.error(error);
      reject();
    });
});
