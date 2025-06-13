import React, { useState } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import CustomSelect from './CustomSelect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AddTaskSection = ({ onBack, onAddNewTask , name }) => {
    const [ hour, setHour] = useState('12');
    const [ minute, setMinute] = useState('00');
    const [ ampm, setAmPm] = useState('AM');
    const [ taskName, setTaskName] = useState("");
    const [ dayType, setDayType] = useState('today');

    const hours = [...Array(12).keys()].map(i => String(i + 1).padStart(2, '0'));
    const minutes = [...Array(60).keys()].map(i => String(i).padStart(2, '0'));
    const ampmOptions = ['AM', 'PM'];
    const dayOptions = [
      { label: 'Today', value: 'today' },
      { label: 'Tomorrow', value: 'tomorrow' }
    ];

    const handleAdd = () => {
      if (!taskName.trim()) {
        toast.error('Oops, you have not added any todo list!', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        return;
      }
      const time = `${hour}:${minute} ${ampm}`;
      onAddNewTask({ text: taskName, time }, dayType, false); // pass false to NOT navigate
      setTaskName("");
      toast.success('Your task has been added to todo-list!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    };

    return (
    <div className="add-task-container">
        <div className="add-task-header">
            <FaArrowLeftLong className="prev-icon" onClick={() => { if (onBack) onBack(); }} />
            <div className="task-time">
              <p className="task-time-text">Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
            </div>
        </div>
        <div className="task-text">
            <h2>Add new task</h2>
        </div>
        <div className="add-input">
            <p>Task Name</p>
            <input type="text" placeholder='Add task name here' value={taskName} onChange={e => setTaskName(e.target.value)} />
        </div>
        <div className="picker-header">
            <h4>Time</h4>
        </div>
        <div className="time-picker" style={{ display: 'flex', gap: '10px' }}>
            <CustomSelect
                options={hours}
                value={hour}
                onChange={setHour}
                label="Hour"
            />
            <CustomSelect
                options={minutes}
                value={minute}
                onChange={setMinute}
                label="Minute"
            />
            <CustomSelect
                options={ampmOptions}
                value={ampm}
                onChange={setAmPm}
                label="AM/PM"
            />
        </div>
        <div className="picker-header">
          <h4>Day</h4>
        </div>
        <div className="time-picker" style={{ display: 'flex', gap: '10px' }}>
          <select value={dayType} onChange={e => setDayType(e.target.value)} style={{ padding: '0.5rem', borderRadius: '0.5rem' }}>
            {dayOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <button className="add-todo-task" onClick={handleAdd} type="button">
            <span>Add task to list</span>
        </button>
        <marquee behavior="scroll" direction="left" loop="5" width="300px" style={{marginTop: '30px'}}>
          Hi {name}, Welcome! Please add your todo to the list
        </marquee>
        <ToastContainer />
  </div>

    )
}

export default AddTaskSection