import type { Tweet } from '../types';

interface TweetPreviewProps {
  tweets: Tweet[];
}

export function TweetPreview({ tweets }: TweetPreviewProps) {
  if (tweets.length === 0) {
    return null;
  }

  return (
    <div className="tweet-section">
      <h4>🐦 화제의 트윗</h4>
      <div className="tweet-list">
        {tweets.map((tweet) => (
          <a
            key={tweet.id}
            href={tweet.url}
            target="_blank"
            rel="noopener noreferrer"
            className="tweet-card"
          >
            <div className="tweet-header">
              <span className="tweet-author">{tweet.author}</span>
              <span className="tweet-handle">{tweet.authorHandle}</span>
            </div>
            <p className="tweet-content">{tweet.content}</p>
            <div className="tweet-stats">
              <span className="tweet-stat">
                ❤️ {tweet.likes.toLocaleString()}
              </span>
              <span className="tweet-stat">
                🔁 {tweet.retweets.toLocaleString()}
              </span>
              <span className="tweet-date">{tweet.date}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
