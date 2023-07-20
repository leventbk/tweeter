/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
// Test / driver code (temporary). Eventually will get this from the server.

const renderTweets = function (arrOfTweetObj) {
  $('#main-tweet-container').html("");
  for (const tweetData of arrOfTweetObj.reverse()) {
    const $tweet = createTweetElement(tweetData);
    $('#main-tweet-container').append($tweet);
  }
};

const createTweetElement = function (tweet) {

  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  const $tweet = $(`
    <section class="tweet-container">
      <article>
        <header class=tweet-head>
          <div class="user-data">
            <img src="${escape(tweet.user.avatars)}"/>
            <p>${escape(tweet.user.name)}</p>
          </div>
          <div >
            <span class="user-handle">${escape(tweet.user.handle)}</span>
          </div>
        </header>
        <div class="tweet-container-body">
        <p>${escape(tweet.content.text)}</p>
        </div>
        <footer class="tweet-container-footer">
          <div class="tcf-time">
            <div>${escape(timeago.format(tweet.created_at))}</div>
          </div>
          <div class="tcf-button">
            <button class="btn"><i class="fa fa-solid fa-flag"></i></button>
            <button class="btn"><i class="fa-sharp fa-solid fa-retweet"></i></button>
            <button class="btn"><i class="fa-solid fa-heart"></i></button>
          </div>
        </footer>
      </article>
    </section>

    `);

  return $tweet;
}

//renderTweets(data);

$(document).ready(function () {

  function loadTweets() {
    $.ajax('http://localhost:8080/tweets', { method: 'GET' })
      .then(function (data) {
        renderTweets(data);
      });
  }

  $("#new-tweet").on("submit", function (event) {
    event.preventDefault();
    if ($("#tweet-text").val().length > 140) { // To check if the text area is empty or the text is too long. 
      $('.error-message').text("Message is too long");
    } else if ($("#tweet-text").val().length === 0) {
      $('.error-message').text("Message is empty!");
    } else {
      console.log("#1 submit form tweet")
      const serializedData = $(this).serialize();
      console.log("#2 serialized data ", serializedData)
      $.ajax({
        type: "POST",
        url: "/tweets",
        data: serializedData,
      })
        .done(function () { // to load new tweet on top of the tweet-text area. Before .done function the server could not response on time. 
          $("#tweet-text").val("")
          loadTweets();
        });
    }
  }
  );

  loadTweets();
});
