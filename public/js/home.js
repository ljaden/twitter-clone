// event listener on load
window.addEventListener('DOMContentLoaded', async(event) => {
  // grab tweetContainer element
  const tweetContainer = document.getElementById('tweetContainer')

  // GET request
  fetch('/api/posts')
    .then(response => response.json())
    .then(data => outputPosts(data,tweetContainer))

  //  
  function outputPosts(info,container) {
    // return html element for each post
    info.forEach(tweet => {
      const html = createHtml(tweet)
      container.prepend(html)
    })
    // if database has no tweets, display Empty
    if (info.length === 0) {
      container.innerHtml = `<span>Empty</span>`
    }
  }
})