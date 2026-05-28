import { useEffect, useState } from 'react';
import api from '../api/api';
import LiveChat from '../components/LiveChat';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    api.get('/posts').then((res) => setPosts(res.data));
  }, []);

  const submitPost = async () => {
    const formData = new FormData();
    formData.append('caption', caption);
    if (file) formData.append('media', file);
    const response = await api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    setPosts([response.data, ...posts]);
    setCaption('');
    setFile(null);
  };

  const likePost = async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    setPosts(posts.map((post) => (post._id === postId ? response.data : post)));
  };

  return (
    <div className="grid-2">
      <section className="card">
        <h2>Feed</h2>
        <div className="post-creator">
          <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Share an update..." />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={submitPost}>Post</button>
        </div>
        {posts.map((post) => (
          <article key={post._id} className="post-card">
            <div className="post-header">
              <strong>{post.author?.username || 'Anonymous'}</strong>
              <span>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <p>{post.caption}</p>
            {post.mediaUrl && <img src={post.mediaUrl} alt="post media" />}
            <div className="post-actions">
              <button onClick={() => likePost(post._id)}>Like ({post.likes.length})</button>
              <span>{post.comments.length} comments</span>
            </div>
          </article>
        ))}
      </section>
      <LiveChat recipientId="" />
    </div>
  );
};

export default HomePage;
