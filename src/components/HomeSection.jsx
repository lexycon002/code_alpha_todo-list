import React, { useState } from 'react'
import { IoMdAdd } from "react-icons/io";
import { MdOutlineDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

const HomeSection = ({ name, imagePreview, onAddTask, todayTasks, nextdayTasks, setTodayTasks, setNextdayTasks, onBackToWelcome }) => {
  const [editing, setEditing] = useState({ id: null, type: null });
  const [editValue, setEditValue] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalTaskType, setModalTaskType] = useState(null);
  const [modalTaskId, setModalTaskId] = useState(null);
  const [editError, setEditError] = useState("");

  const handleCheck = (type, id) => {
    if (type === 'today') {
      setTodayTasks(tasks => tasks.map(task => task.id === id ? { ...task, checked: !task.checked } : task));
    } else {
      setNextdayTasks(tasks => tasks.map(task => task.id === id ? { ...task, checked: !task.checked } : task));
    }
  };

  const handleDelete = (type, id) => {
    if (type === 'today') {
      setTodayTasks(tasks => tasks.filter(task => task.id !== id));
    } else {
      setNextdayTasks(tasks => tasks.filter(task => task.id !== id));
    }
  };

  const startEdit = (type, task) => {
    setEditing({ id: task.id, type });
    setEditValue(task.text);
    setShowEditModal(true);
    setModalTaskType(type);
    setModalTaskId(task.id);
  };

  const saveEdit = () => {
    if (!editValue.trim()) {
      setEditError("Task cannot be empty");
      return;
    }
    if (modalTaskType === 'today') {
      setTodayTasks(tasks => tasks.map(task => task.id === modalTaskId ? { ...task, text: editValue } : task));
    } else {
      setNextdayTasks(tasks => tasks.map(task => task.id === modalTaskId ? { ...task, text: editValue } : task));
    }
    setEditing({ id: null, type: null });
    setEditValue("");
    setShowEditModal(false);
    setModalTaskType(null);
    setModalTaskId(null);
    setEditError("");
  };

  const cancelEdit = () => {
    setEditing({ id: null, type: null });
    setEditValue("");
    setShowEditModal(false);
    setModalTaskType(null);
    setModalTaskId(null);
  };

  // Check and update tasks as time passes
  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formatTime = (t) => {
        // t: 'hh:mm AM/PM'
        const [time, ampm] = t.split(' ');
        let [h, m] = time.split(':').map(Number);
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        const d = new Date();
        d.setHours(h, m, 0, 0);
        return d;
      };
      setTodayTasks(tasks => tasks.map(task => {
        if (!task.striked) {
          const taskTime = formatTime(task.time);
          if (now >= taskTime) {
            return { ...task, striked: true };
          }
        }
        return task;
      }));
      setNextdayTasks(tasks => tasks.map(task => {
        if (!task.striked) {
          const taskTime = formatTime(task.time);
          if (now >= taskTime) {
            return { ...task, striked: true };
          }
        }
        return task;
      }));
    }, 30000); // check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h2>Welcome, {name}!</h2>
      <div className="image-container">
        {imagePreview && (
          <img src={imagePreview} alt="User" style={{ width: "60px", height: "60px", borderRadius: "50%" }} />
        )}
      </div>
      <div className="home-section-container">
        <span className="border"></span>
        <div className="today-section">
          <h4>Today</h4>
          <button className="add-btn" onClick={onAddTask}>
            <span><IoMdAdd className="add-icon" /></span>
          </button>
        </div>
        <div className="today-tasks">
          {todayTasks.map(task => (
            <div className="home-task" key={task.id}>
              <div className="home-checkbox">
                <input type="checkbox" checked={task.checked} onChange={() => handleCheck('today', task.id)} />
                {editing.id === task.id && editing.type === 'today' ? (
                  <>
                    <input
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveEdit('today', task.id); if (e.key === 'Escape') cancelEdit(); }}
                      autoFocus
                      style={{ width: '100px', marginRight: '8px' }}
                    />
                    <button onClick={() => saveEdit('today', task.id)} style={{ marginRight: 4 }}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <p style={task.striked ? { textDecoration: 'line-through', color: '#888' } : {}}>{task.text}</p>
                )}
              </div>
              <span className="home-time">
                <p className="time">{task.time}</p>
                {task.checked && <><MdOutlineDeleteForever className="delete-icon" onClick={() => handleDelete('today', task.id)} /> <CiEdit className="edit-icon" onClick={() => startEdit('today', task)} /></>}
              </span>
            </div>
          ))}
        </div>
        <span className="border"></span>
        <div className="nextday-section-container">
          <div className="nextday-section">
            <h4>Tomorrow</h4>
            <button className='add-btn' onClick={onAddTask}>
              <span><IoMdAdd className='add-icon'/></span>
            </button>
          </div>
          <div className="nextday-tasks">
            {nextdayTasks.map(task => (
              <div className="home-task" key={task.id}>
                <div className='home-checkbox'>
                  <input type="checkbox" checked={task.checked} onChange={() => handleCheck('nextday', task.id)} />
                  {editing.id === task.id && editing.type === 'nextday' ? (
                    <>
                      <input
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveEdit('nextday', task.id); if (e.key === 'Escape') cancelEdit(); }}
                        autoFocus
                        style={{ width: '120px', marginRight: '8px' }}
                      />
                      <div className="button-wrap">
                          <button onClick={() => saveEdit('nextday', task.id)} style={{ marginRight: 4 }}>Save</button>
                          <button onClick={cancelEdit}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <p style={task.striked ? { textDecoration: 'line-through', color: '#888' } : {}}>{task.text}</p>
                  )}
                </div>
                <span className="home-time">
                  <p className="time">{task.time}</p>
                  {task.checked && 
                  <>
                  <MdOutlineDeleteForever className="delete-icon" onClick={() => handleDelete('nextday', task.id)} /> 
                  <CiEdit className="edit-icon" onClick={() => startEdit('nextday', task)} />
                  </>
                  }
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="home-navigation-section">
        <button className="todo-list-add" onClick={onAddTask}>
          <IoMdAdd className="todo-list-icon" />
        </button>
      </div>
      <div className="back-to-home-section">
        <button className='back-to-home' type='button' onClick={() => { if (onBackToWelcome) onBackToWelcome(); }}>
          Back to home
        </button>
      </div>
      {showEditModal && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h3>Edit Task</h3>
            <input
              value={editValue}
              onChange={e => { setEditValue(e.target.value); setEditError(""); }}
              autoFocus
              style={{ width: '90%', marginBottom: '12px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}
            />
            {editError && <div style={{ color: 'red', marginBottom: 8 }}>{editError}</div>}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={saveEdit} style={{ background: 'green', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 18px' }}>Save</button>
              <button onClick={cancelEdit} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: '6px', padding: '8px 18px' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomeSection