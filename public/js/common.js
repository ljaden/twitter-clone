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

  const html = createTweetHtml(tweetContent)
 
  const tweetsContainer = document.getElementById('tweetContainer')
  tweetsContainer.prepend(html)

  // reset tweet form
  document.getElementById('postTweetArea').value = ''
  // disable tweet button
  document.getElementById('submitTweetBtn').disabled = true 
  
})

function createTweetHtml(data) {
  // create container element with id 'post'
  let divPost = document.createElement('div')
  divPost.id = 'post'

  // create container element with class 'mainContentContainer'
  
  let divMainContentContainer = document.createElement('div')
  divMainContentContainer.className = 'mainContentContainer'
  // create container with class 'userProfilePic'
  
  let divUserProfilePic = document.createElement('div')
  divUserProfilePic.className = 'userProfilePic'

  // ceate img element and set src attribute to user's profile picture
  let profilePic = document.createElement('img')
  profilePic.setAttribute(`src`,data.postedBy.profilePic)
  
  // 
  divUserProfilePic.appendChild(profilePic)
  divMainContentContainer.appendChild(divUserProfilePic)
  
  // create paragraph element for tweet
  let para = document.createElement('p')
  // let tweet = document.createTextNode(data.content)
  para.textContent = data.content
  divMainContentContainer.appendChild(para)

  return divMainContentContainer
}
  // createPost(response.json())
