const textarea = document.getElementById('postTweetArea')
// enable/disable tweet button
textarea.addEventListener('keyup',() => {
  const btnTweet = document.getElementById('submitTweetBtn')
  
  if(textarea.value.trim().length > 0){
    btnTweet.disabled = false
  } else {
    btnTweet.disabled = true
  }
})

const twt = document.getElementById('tweetForm')
// submit/Tweet post
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

// like tweet
const tweetContainer = document.getElementById("tweetContainer")
tweetContainer.addEventListener('click', async(e) => {
  const btnLike = e.target

  if (btnLike.classList.contains('likeBtn')){
    // find closest post id
    const postId = getPostId(btnLike)  
    //
    if(postId === undefined) return;

    const dataObj = {
      id:postId
    }
    // PUT request -- 
    const liked = await fetch(`/api/posts/${postId}/like`,{
      method: 'PUT',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(dataObj)
    })
    const response = await liked.json()
    
    // update likes
    btnLike.children[1].innerHTML = response.likes.length || ""

    // check if user likes post
    if(response.likes.includes(userObj['_id'])) {
      // add 'active' class
      btnLike.classList.add('active') 
    }else {
      // remove 'active' class
      btnLike.classList.remove('active')
    }
  }
})

// retweet post
tweetContainer.addEventListener('click', async(e) => {
  const retweetBtn = e.target

  if(retweetBtn.classList.contains('retweetBtn')){
    // get id of post
    const postId = getPostId(retweetBtn)
    // 
    if(postId === undefined) return;

    const dataObj = {
      id:postId
    }

    // PUT request -- 
    const retweeted = await fetch(`/api/posts/${postId}/retweet`,{
      method: 'PUT',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(dataObj)
    })
    const response = await retweeted.json()
    
    // check if user likes post
    if(response.retweets.includes(userObj['_id'])) {
      // add 'active' class
      retweetBtn.classList.add('active') 
    }else {
      // remove 'active' class
      retweetBtn.classList.remove('active')
    }
}
  
})

// function to create dynamic content
function createHtml(data) {
  // users info
  const id = data._id
  const tweet = data.content
  const name = data.postedBy.fullname
  const username = data.postedBy.username
  const profilePic = data.postedBy.profilePic
  const timeAgo = timeDifference(new Date(), new Date(data.createdAt))

  // display "" if 0 likes
  const likes = data.likes.length || ""
  // set 'active' class for tweets liked by user
  const activeLike = data.likes.includes(userObj._id)? 'active':''
  // set 'active' class for retweets by user
  const activeRetweet = data.retweets.includes(userObj._id)? 'active':''

  // create a div element
  const template = document.createElement('div')
  template.className = 'post'
  template.dataset.id = id
  // tweet component
  let component =
  `<div class="mainContentContainer">
    <div class="userProfilePic">
      <img src="${profilePic}" alt="profile picture">
    </div>

    <div class="tweetContentContainer">

      <div class="tweetHeader">
        <a href="${username}" class="displayName">${name}</a><span class="username">@${username}</span><span class="date">~${timeAgo}</span>
      </div>

      <div class="tweetBody">
        <span>${tweet}</span>
      </div>
      <div class='tweetFooter'>
        <div class='tweetBtnContainer'>
          <button>
            <i class="fa-regular fa-comment fa-lg"></i>
          </button>
        </div>
        <div class='tweetBtnContainer green'>
          <button class="retweetBtn ${activeRetweet}">
            <i class="fa-solid fa-retweet fa-lg"></i>
          </button>
        </div>
        <div class='tweetBtnContainer red'>
          <button class="likeBtn ${activeLike}">
            <i class="fa-regular fa-heart fa-lg"></i><span>${likes}</span>
          </button>
        </div>
      </div>
    </div>
  </div>`

  template.innerHTML = component.trim()

  return template;
}
// returns relative time ago e.g "1min ago" "1hour ago"
function timeDifference(current, previous) {

  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    if(elapsed/1000 < 30){
      return "Just now"
    }
       return Math.round(elapsed/1000) + ' seconds ago';   
  }

  else if (elapsed < msPerHour) {
       return Math.round(elapsed/msPerMinute) + ' mins ago';   
  }

  else if (elapsed < msPerDay ) {
       return Math.round(elapsed/msPerHour ) + ' hours ago';   
  }

  else if (elapsed < msPerMonth) {
      return Math.round(elapsed/msPerDay) + ' days ago';   
  }

  else if (elapsed < msPerYear) {
      return Math.round(elapsed/msPerMonth) + ' months ago';   
  }

  else {
      return Math.round(elapsed/msPerYear ) + ' years ago';   
  }
}

// returns closest parent element with class 'post'
function getPostId(element) {
  const isRoot = element.classList.contains('post')
  const rootElement = isRoot ? element : element.closest('.post')

  const postId = rootElement.dataset.id

  return postId
}

