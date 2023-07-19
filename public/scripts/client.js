/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
// Test / driver code (temporary). Eventually will get this from the server.
const renderTweets = function (tweets) {
  const $tweetContainer = $('#main-tweet-container');
  $tweetContainer.empty();

  tweets.forEach(tweet => {        // calls createTweetElement for each tweet
    const $tweetElement = createTweetElement(tweet);
    $tweetContainer.append($tweetElement);  // takes return value and appends it to the tweets container
  });
}

const createTweetElement = function (tweet) {

  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // const $header = $('<header>');
  // const $avatars = $('<img>').addClass('avatars').attr('src', tweet.avatars);;
  // const $name = $('<span>').addClass('name').text(tweet.user.name);
  // $header.append($avatars, $name)

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

    if ($("#tweet-text").val().length > 140) { // To check if the text area is empty or the text is too long. 
      $('.error-message').text("Message is too long");
    } else if ($("#tweet-text").val().length === 0) {
      $('.error-message').text("Message is empty!");
    } else {
      const serializedData = $("#new-tweet").serialize();
      $.ajax({
        type: "POST",
        url: "/tweets",
        data: serializedData,
      })
        .done(function (data) { // to load new tweet on top of the tweet-text area. Before .done function the server could not response on time. 
          $("#tweet-text").val("")
          loadTweets();
        });
    }

    event.preventDefault();
  });

  loadTweets();
});
