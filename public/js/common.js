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
twt.addEventListener('submit',(e)=>{
  e.preventDefault()

  const details = {
    content: document.getElementById('postTweetArea').value
  };

let formBody = [];
for (let property in details) {
  const encodedKey = encodeURIComponent(property);
  const encodedValue = encodeURIComponent(details[property]);
  formBody.push(encodedKey + "=" + encodedValue);
}
// console.log(formBody) // => ['content=<tweet>']
formBody = formBody.join("&"); // => 'content=<tweet>'

// send tweet to server -- /api/posts 
fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  body: formBody
})
.then(response => console.log(response.json())) // prints the response object
})