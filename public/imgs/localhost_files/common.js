
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



const postTweet = (data) => {
  axios.post('/api/posts',data)
  .then(response =>{
    console.log('POST: ',response.data)
  })
}

const tweetForm = document.getElementById('tweetForm')
tweetForm.addEventListener('submit',event => {
  event.preventDefault();

  const data = {
    content: postTweetArea.value.trim()
  }

  console.log(data)
  postTweet(data);
})