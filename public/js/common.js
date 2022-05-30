// enable/disable tweet button
const textarea = document.getElementById('postTweetArea')
const btnTweet = document.getElementById('submitTweetBtn')

textarea.addEventListener('keyup',() => {
  if(textarea.value.trim().length > 0){
    btnTweet.disabled = false
  } else {
    btnTweet.disabled = true
  }
})


// application/x-www-form-urlencoded
const twt = document.getElementById('tweetForm')
twt.addEventListener('submit',async (e)=>{
  e.preventDefault()

  const details = {
    // grab users input
    content: document.getElementById('postTweetArea').value
  };

  // formating the data
  const encodedTweetData = (data) => {
    let formBody = []
    for(let property in data) {
      const encodedKey = encodeURIComponent(property)
      const encodedVal = encodeURIComponent(data[property])
      // append 'content=<tweet>' to formBody arry
      formBody.push(`${encodedKey}=${encodedVal}`) 
    }
    return formBody.join('&')
  }

  // send POST request to /api/posts -- stores tweet in db -- 
  const rawResponse = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: encodedTweetData(details)
  })

  // returned json object from POST
  const tweetContent = await rawResponse.json()
  // const html = createTweetHtml(tweetContent)
  const html = createHtml(tweetContent)

  const tweetsContainer = document.getElementById('tweetContainer')
  tweetsContainer.prepend(html)

  // reset tweet form
  document.getElementById('postTweetArea').value = ''
  // disable tweet button
  document.getElementById('submitTweetBtn').disabled = true 
})

function createHtml(data) {
  // // Variables For Future Use
  // const tweet = data.content
  // const name = data.postedBy.fullname
  // const email = data.postedBy.email
  // const profilePic = data.postedBy.profilePic
  // const timestamp = 'create later'


  // create a div element
  const template = document.createElement('div')
  template.className = 'post'
  // tweet component
  let component =
  `<div class="mainContentContainer">
    <div class="userProfilePic">
      <img src="${data.postedBy.profilePic}" alt="profile picture">
    </div>
    <div class="tweetContentContainer">
      <div class="tweetHeader">
        <a href="${data.postedBy.username}" class="displayName">${data.postedBy.fullname}</a> 
        <span class="username">@${data.postedBy.username}<span>
        <span class="date">timestamp - *hours ago*<span>
      </div>
      <div class="tweetBody">
        <span>${data.content}</span>
      </div>
      <div class='tweetFooter'>
        <div class='tweetBtnContainer'>
          <button>
            <i class="fa-regular fa-comment fa-lg"></i>
          </button>
        </div>
        <div class='tweetBtnContainer'>
          <button>
            <i class="fa-solid fa-retweet fa-lg"></i>
          </button>
        </div>
        <div class='tweetBtnContainer'>
          <button>
            <i class="fa-regular fa-heart fa-lg"></i>
          </button>
        </div>
      </div>
    </div>
  </div>`

  template.innerHTML = component.trim()

  return template;
}
