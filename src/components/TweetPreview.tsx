import { Tweet as ReactTweet } from 'react-tweet';
import type { Tweet } from '../types';

interface TweetPreviewProps {
  tweets: Tweet[];
}

// 트윗 URL에서 ID 추출
function extractTweetId(url: string): string | null {
  const match = url.match(/status\/(\d+)/);
  return match ? match[1] : null;
}

export function TweetPreview({ tweets }: TweetPreviewProps) {
  if (tweets.length === 0) {
    return null;
  }

  return (
    <div className="tweet-section">
      <h4>🐦 화제의 트윗</h4>
      <div className="tweet-embed-list">
        {tweets.map((tweet) => {
          const tweetId = extractTweetId(tweet.url);
          if (!tweetId) return null;

          return (
            <div key={tweet.id} className="tweet-embed-wrapper" data-theme="dark">
              <ReactTweet id={tweetId} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
