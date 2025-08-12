import React, { useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import './Schedule.css';

interface ScheduleEntry {
  id: string;
  subject: string;
  day: string;
  time: string;
  room: string;
  notes?: string;
}

interface Homework {
  id: string;
  title: string;
  description: string;
  assignedDate: string;
  deadline: string;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const DAY_LABELS: Record<string, string> = {
  Mon: 'จันทร์',
  Tue: 'อังคาร',
  Wed: 'พุธ',
  Thu: 'พฤหัสบดี',
  Fri: 'ศุกร์',
};

const TIME_SLOTS = [
  '08:30-09:30',
  '09:30-10:30',
  '10:30-11:30',
  '11:30-12:30',
  '12:30-13:30',
  '13:30-14:30',
  '14:30-15:30',
  '15:30-16:30',
  '16:30-17:30',
];

const Schedule: React.FC<{ userEmail: string; isOwner: boolean }> = ({ userEmail, isOwner }) => {
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [subject, setSubject] = useState('');
  const [day, setDay] = useState(DAYS[0]);
  const [time, setTime] = useState('');
  const [room, setRoom] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<ScheduleEntry | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  // สำหรับ homework ของแต่ละ entry
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [hwTitle, setHwTitle] = useState('');
  const [hwDesc, setHwDesc] = useState('');
  const [hwAssigned, setHwAssigned] = useState('');
  const [hwDeadline, setHwDeadline] = useState('');
  const [editingNote, setEditingNote] = useState('');
  const [editingHwId, setEditingHwId] = useState<string | null>(null);

  useEffect(() => {
    const colRef = collection(db, 'schedules', userEmail, 'entries');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data: ScheduleEntry[] = [];
      snapshot.forEach(docSnap => {
        data.push({ id: docSnap.id, ...docSnap.data() } as ScheduleEntry);
      });
      setEntries(data);
    });
    return () => unsubscribe();
  }, [userEmail]);

  const addEntry = async () => {
    if (subject && day && time && room) {
      const colRef = collection(db, 'schedules', userEmail, 'entries');
      await addDoc(colRef, { subject, day, time, room, notes });
      setSubject('');
      setTime('');
      setRoom('');
      setNotes('');
    }
  };

  const deleteEntry = async (id: string) => {
    const docRef = doc(db, 'schedules', userEmail, 'entries', id);
    await deleteDoc(docRef);
  };

  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  function isTimeOverlap(slot: string, time: string) {
    const [slotStart, slotEnd] = slot.split('-');
    const [timeStart, timeEnd] = time.split('-');
    return !(toMinutes(slotEnd) <= toMinutes(timeStart) || toMinutes(slotStart) >= toMinutes(timeEnd));
  }

  // "cell แรก" = slot ที่ slotStart อยู่ในช่วงเวลาเรียน และไม่มี slot ก่อนหน้าที่ซ้อนกับ entry นี้
  function isFirstOverlapSlot(slotIdx: number, entry: ScheduleEntry, timeSlots: string[]) {
    if (!isTimeOverlap(timeSlots[slotIdx], entry.time)) return false;
    if (slotIdx === 0) return true;
    // ถ้า slot ก่อนหน้าไม่ overlap กับ entry นี้ แปลว่า cell นี้คือ cell แรก
    return !isTimeOverlap(timeSlots[slotIdx - 1], entry.time);
  }

  // สุ่มสีพื้นหลังแต่ละวิชา (หรือจะ fix สีเองก็ได้)
  function getColor(subject: string) {
    const colors = [
      "#e3f2fd", "#fce4ec", "#e8f5e9", "#fff3e0", "#f3e5f5", "#f9fbe7", "#ede7f6"
    ];
    let hash = 0;
    for (let i = 0; i < subject.length; i++) hash += subject.charCodeAt(i);
    return colors[hash % colors.length];
  }

  // โหลด homework เมื่อเลือก entry
  useEffect(() => {
    if (!selectedEntry) return;
    const colRef = collection(db, "schedules", userEmail, "entries", selectedEntry.id, "homework");
    const unsub = onSnapshot(colRef, snap => {
      const arr: Homework[] = [];
      snap.forEach(doc => arr.push({ id: doc.id, ...doc.data() } as Homework));
      setHomeworks(arr);
    });
    setEditingNote(selectedEntry.notes || '');
    return () => unsub();
  }, [selectedEntry, userEmail]);

  // แก้ไข note
  const handleSaveNote = async () => {
    if (!selectedEntry) return;
    const docRef = doc(db, "schedules", userEmail, "entries", selectedEntry.id);
    await updateDoc(docRef, { notes: editingNote });
    // อัปเดตใน state ด้วย
    setSelectedEntry({ ...selectedEntry, notes: editingNote });
  };

  // เพิ่มการบ้าน
  const handleAddHomework = async () => {
    if (!selectedEntry || !hwTitle || !hwAssigned || !hwDeadline) return;
    const colRef = collection(db, "schedules", userEmail, "entries", selectedEntry.id, "homework");
    await addDoc(colRef, {
      title: hwTitle,
      description: hwDesc,
      assignedDate: hwAssigned,
      deadline: hwDeadline
    });
    setHwTitle(''); setHwDesc(''); setHwAssigned(''); setHwDeadline('');
  };

  // ลบการบ้าน
  const handleDeleteHomework = async (id: string) => {
    if (!selectedEntry) return;
    const docRef = doc(db, "schedules", userEmail, "entries", selectedEntry.id, "homework", id);
    await deleteDoc(docRef);
  };

  // แก้ไขการบ้าน
  const handleEditHomework = async (id: string) => {
    if (!selectedEntry) return;
    const docRef = doc(db, "schedules", userEmail, "entries", selectedEntry.id, "homework", id);
    await updateDoc(docRef, {
      title: hwTitle,
      description: hwDesc,
      assignedDate: hwAssigned,
      deadline: hwDeadline
    });
    setEditingHwId(null);
    setHwTitle(''); setHwDesc(''); setHwAssigned(''); setHwDeadline('');
  };

  return (
    <div className="schedule-container">
      <h2>Class Schedule</h2>
      {isOwner && (
        <div className="schedule-form">
          <input
            placeholder="Subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
          />
          <select value={day} onChange={e => setDay(e.target.value)}>
            {DAYS.map(d => <option key={d} value={d}>{DAY_LABELS[d]}</option>)}
          </select>
          <input
            placeholder="Time (e.g. 10:30-12:30)"
            value={time}
            onChange={e => setTime(e.target.value)}
          />
          <input
            placeholder="Room (e.g. SC2109)"
            value={room}
            onChange={e => setRoom(e.target.value)}
          />
          <input
            placeholder="หมายเหตุ (Notes, Markdown ได้)"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
          <button onClick={addEntry}>Add</button>
        </div>
      )}
      <div className="schedule-grid-wrapper">
        <table className="schedule-grid">
          <thead>
            <tr>
              <th>วัน/เวลา</th>
              {TIME_SLOTS.map(slot => (
                <th key={slot}>{slot}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map(day => (
              <tr key={day}>
                <td className="time-col">{DAY_LABELS[day]}</td>
                {TIME_SLOTS.map((slot, slotIdx) => {
                  // หา entry ที่ซ้อนกับช่วงเวลานี้
                  const entry = entries.find(
                    e => e.day === day && isTimeOverlap(slot, e.time)
                  );
                  if (!entry) return <td key={day + slot} className="cell"></td>;
                  const bgColor = getColor(entry.subject);

                  if (isFirstOverlapSlot(slotIdx, entry, TIME_SLOTS)) {
                    // cell แรกของช่วงเวลา
                    return (
                      <td
                        key={day + slot}
                        className="cell"
                        style={{
                          background: bgColor,
                          borderLeft: "4px solid #1976d2",
                          opacity: 1
                        }}
                      >
                        <div className="cell-content" style={{ alignItems: "flex-start", cursor: "pointer" }} onClick={() => { setSelectedEntry(entry); setShowPopup(true); }}>
                          <div>
                            <div style={{ fontWeight: "bold", fontSize: 12, marginBottom: 1 }}>
                              <ReactMarkdown>{entry.subject}</ReactMarkdown>
                            </div>
                            <div style={{ fontSize: 11, color: '#888', marginBottom: 1 }}>
                              <ReactMarkdown>{entry.room}</ReactMarkdown>
                            </div>
                            <div style={{ fontSize: 11, color: '#555', marginBottom: 1 }}>{entry.time}</div>
                            {entry.notes && (
                              <div style={{ fontSize: 11, color: '#444', marginTop: 1 }}>
                                <ReactMarkdown>{entry.notes}</ReactMarkdown>
                              </div>
                            )}
                          </div>
                          {isOwner && (
                            <button className="delete-btn" style={{ marginTop: 6 }} onClick={() => deleteEntry(entry.id)}>ลบ</button>
                          )}
                        </div>
                      </td>
                    );
                  } else {
                    // cell ถัดไปในช่วงเวลา
                    return (
                      <td
                        key={day + slot}
                        className="cell"
                        style={{
                          background: bgColor,
                          opacity: 0.85
                        }}
                      ></td>
                    );
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPopup && selectedEntry && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "#0008", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center"
          }}
          onClick={() => { setShowPopup(false); setSelectedEntry(null); }}
        >
          <div
            style={{ background: "#fff", padding: 24, borderRadius: 10, minWidth: 320, maxWidth: 400 }}
            onClick={e => e.stopPropagation()}
          >
            <h3>{selectedEntry.subject}</h3>
            <div>เวลา: {selectedEntry.time}</div>
            <div>ห้อง: {selectedEntry.room}</div>
            <div>
              <b>หมายเหตุ:</b>
              {isOwner ? (
                <>
                  <textarea value={editingNote} onChange={e => setEditingNote(e.target.value)} rows={3} style={{ width: "100%" }} />
                  <button onClick={handleSaveNote}>บันทึกหมายเหตุ</button>
                </>
              ) : (
                <div style={{ whiteSpace: "pre-wrap" }}>{selectedEntry.notes}</div>
              )}
            </div>
            <hr />
            <b>การบ้าน</b>
            {isOwner && (
              <div style={{ marginBottom: 8 }}>
                <input placeholder="ชื่อการบ้าน" value={hwTitle} onChange={e => setHwTitle(e.target.value)} />
                <input placeholder="วันที่สั่ง" type="date" value={hwAssigned} onChange={e => setHwAssigned(e.target.value)} />
                <input placeholder="เดดไลน์" type="date" value={hwDeadline} onChange={e => setHwDeadline(e.target.value)} />
                <textarea placeholder="รายละเอียด" value={hwDesc} onChange={e => setHwDesc(e.target.value)} />
                {editingHwId ? (
                  <button onClick={() => handleEditHomework(editingHwId)}>บันทึกแก้ไข</button>
                ) : (
                  <button onClick={handleAddHomework}>เพิ่ม</button>
                )}
              </div>
            )}
            <ul>
              {homeworks.map(hw => (
                <li key={hw.id} style={{ marginBottom: 6 }}>
                  <b>{hw.title}</b> ({hw.assignedDate} - {hw.deadline})<br />
                  {hw.description}
                  {isOwner && (
                    <>
                      <button style={{ marginLeft: 8 }} onClick={() => {
                        setEditingHwId(hw.id);
                        setHwTitle(hw.title);
                        setHwDesc(hw.description);
                        setHwAssigned(hw.assignedDate);
                        setHwDeadline(hw.deadline);
                      }}>แก้ไข</button>
                      <button style={{ marginLeft: 4 }} onClick={() => handleDeleteHomework(hw.id)}>ลบ</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
            <button onClick={() => { setShowPopup(false); setSelectedEntry(null); }}>ปิด</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;