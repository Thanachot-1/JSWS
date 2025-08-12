import React, { Component } from 'react';
import { db } from '../../services/firebase';
import { collection, onSnapshot, addDoc, doc, deleteDoc } from 'firebase/firestore';

interface HomeworkAssignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
}

interface HomeworkState {
  assignments: HomeworkAssignment[];
  title: string;
  description: string;
  dueDate: string;
}

class Homework extends Component<{}, HomeworkState> {
  unsubscribe: (() => void) | null = null;

  constructor(props: {}) {
    super(props);
    this.state = {
      assignments: [],
      title: '',
      description: '',
      dueDate: ''
    };
  }

  componentDidMount() {
    const colRef = collection(db, "homework");
    this.unsubscribe = onSnapshot(colRef, (snapshot) => {
      const assignments: HomeworkAssignment[] = [];
      snapshot.forEach((docSnap) => {
        assignments.push({ id: docSnap.id, ...docSnap.data() } as HomeworkAssignment);
      });
      this.setState({ assignments });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    this.setState({ ...this.state, [name]: value });
  };

  addAssignment = async () => {
    const { title, description, dueDate } = this.state;
    if (title && description && dueDate) {
      const colRef = collection(db, "homework");
      await addDoc(colRef, { title, description, dueDate });
      this.setState({ ...this.state, title: '', description: '', dueDate: '' });
    }
  };

  deleteAssignment = async (id: string) => {
    const docRef = doc(db, "homework", id);
    await deleteDoc(docRef);
  };

  render() {
    const { assignments, title, description, dueDate } = this.state;
    return (
      <div>
        <h2>Homework</h2>
        <input name="title" value={title} onChange={this.handleInputChange} placeholder="Title" />
        <textarea name="description" value={description} onChange={this.handleInputChange} placeholder="Description" />
        <input name="dueDate" value={dueDate} onChange={this.handleInputChange} placeholder="Due Date" />
        <button onClick={this.addAssignment}>Add</button>
        <ul>
          {assignments.map(a => (
            <li key={a.id}>
              <b>{a.title}</b> ({a.dueDate})<br />
              {a.description}
              <button onClick={() => this.deleteAssignment(a.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Homework;