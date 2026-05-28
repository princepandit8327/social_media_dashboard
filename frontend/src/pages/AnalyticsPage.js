import { useEffect, useState } from 'react';
import api from '../api/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [topPosts, setTopPosts] = useState([]);

  useEffect(() => {
    api.get('/analytics/stats').then((res) => setStats(res.data));
    api.get('/analytics/top-posts').then((res) => setTopPosts(res.data));
  }, []);

  return (
    <section className="card">
      <h2>Analytics Dashboard</h2>
      {stats ? (
        <div className="analytics-grid">
          <div className="metric-card">Users: {stats.totalUsers}</div>
          <div className="metric-card">Posts: {stats.totalPosts}</div>
          <div className="metric-card">Messages: {stats.totalMessages}</div>
          <div className="metric-card">Likes: {stats.totalLikes}</div>
          <div className="metric-card">Comments: {stats.totalComments}</div>
        </div>
      ) : (
        <p>Loading metrics...</p>
      )}
      <div className="chart-card">
        <h3>Top Posts</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topPosts.map((post) => ({ title: post.caption || 'Post', likes: post.likes.length, comments: post.comments.length }))}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="likes" fill="#5b8def" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default AnalyticsPage;
