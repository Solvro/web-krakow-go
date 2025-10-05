import Layout from '@/components/Layout';
import FeedPostCard from '@/components/FeedPostCard';
import { mockFeedPosts } from '@/data/mockFeedPosts';

const Feed = () => {
  return (
    <Layout title="Feed Wolontariuszy">
      <div className="space-y-4 pb-24">
        {mockFeedPosts.map((post) => (
          <FeedPostCard key={post.id} post={post} />
        ))}
      </div>
    </Layout>
  );
};

export default Feed;
