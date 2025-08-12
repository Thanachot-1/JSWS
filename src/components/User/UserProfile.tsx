import React, { useEffect, useState } from 'react';

const UserProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ตัวอย่าง mockup (เพราะไม่มี getUserData, updateUserData จริง)
  useEffect(() => {
    setLoading(true);
    try {
      // mock user data
      setUser({ email: 'test@example.com' });
      setEmail('test@example.com');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdate = async () => {
    try {
      // mock update
      alert('Profile updated successfully!');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h2>User Profile</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <button onClick={handleUpdate}>Update</button>
      {error && <div>{error}</div>}
    </div>
  );
};

export default UserProfile;