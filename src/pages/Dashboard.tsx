import React, { useState } from 'react';
import Schedule from '../components/Schedule/Schedule';

const USERS = [
  { email: 'Jaosub@woonsen.com', label: 'เจ้าทรัพย์(แฟนหนุ่ม)' },
  { email: 'Woonsen@jaosub.com', label: 'วุ้นเส้น(แฟนสาว)' }
];

const Dashboard: React.FC<{ currentUser: string }> = ({ currentUser }) => {
  // state สำหรับดูตารางของใคร
  const [viewUser, setViewUser] = useState(currentUser);

  const otherUser = USERS.find(u => u.email !== currentUser);

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 16, display: 'flex', justifyContent: 'center', gap: 12 }}>
        <button
          style={{ padding: '10px 18px', fontSize: '1rem', borderRadius: 8 }}
          onClick={() => setViewUser(currentUser)}
          disabled={viewUser === currentUser}
        >
          ดูตารางของฉัน
        </button>
        <button
          style={{ padding: '10px 18px', fontSize: '1rem', borderRadius: 8 }}
          onClick={() => setViewUser(otherUser?.email || '')}
          disabled={viewUser === otherUser?.email}
        >
          ดูตารางของ {otherUser?.label}
        </button>
      </div>
      <Schedule userEmail={viewUser} isOwner={viewUser === currentUser} />
    </div>
  );
};

export default Dashboard;