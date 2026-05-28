import { useEffect, useState } from 'react';
import api from '../api/api';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    api.get('/users/me').then((res) => {
      setProfile(res.data);
      setBio(res.data.bio || '');
    });
  }, []);

  const updateProfile = async () => {
    const formData = new FormData();
    formData.append('bio', bio);
    if (avatar) formData.append('avatar', avatar);
    const response = await api.put('/users/me', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    setProfile(response.data);
  };

  return (
    <section className="card">
      <h2>Profile</h2>
      {profile && (
        <div className="profile-card">
          <img className="avatar" src={profile.avatar || 'https://via.placeholder.com/150'} alt="Avatar" />
          <div>
            <h3>{profile.username}</h3>
            <p>{profile.email}</p>
            <p>{profile.bio}</p>
            <div className="form-group">
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Update your bio" />
              <input type="file" onChange={(e) => setAvatar(e.target.files[0])} />
              <button onClick={updateProfile}>Save Profile</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfilePage;
