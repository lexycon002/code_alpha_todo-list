import React, { useEffect, useState } from 'react';
import InfoSection from "./components/InfoSection"
import './index.css';
import AddTaskSection from './components/AddTaskSection';
import HomeSection from './components/HomeSection';

const App = () => {
  const [view, setView] = useState('welcome');
  const [name, setName] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [todayTasks, setTodayTasks] = useState(() => {
    const saved = localStorage.getItem("todayTasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [nextdayTasks, setNextdayTasks] = useState(() => {
    const saved = localStorage.getItem("nextdayTasks");
    return saved ? JSON.parse(saved) : [];
  });

  // On mount, check if user info exists in localStorage and set view accordingly
  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    const savedImage = localStorage.getItem("userImagePreview");
    if (savedName && savedImage) {
      setName(savedName);
      setImagePreview(savedImage);
      setView('home');
    }
  }, []);

  // Persist user info to localStorage when it changes
  useEffect(() => {
    if (name) localStorage.setItem("userName", name);
    if (imagePreview) localStorage.setItem("userImagePreview", imagePreview);
  }, [name, imagePreview]);

  // To save to localStorage when the task change
  useEffect(()=> {
    localStorage.setItem("todayTasks", JSON.stringify(todayTasks))
  }, [todayTasks]);

  useEffect(()=> {
    localStorage.setItem("nextdayTasks", JSON.stringify(nextdayTasks))
  }, [nextdayTasks]);

  // Handler to show HomeSection after welcome
  const handleWelcomeComplete = (userName, userImagePreviewOrFile) => {
    // If userImagePreviewOrFile is a File, convert to base64
    if (userImagePreviewOrFile instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setName(userName);
        setImagePreview(reader.result);
        setView('home');
      };
      reader.readAsDataURL(userImagePreviewOrFile);
    } else {
      setName(userName);
      setImagePreview(userImagePreviewOrFile);
      setView('home');
    }
  };

  // Handler to show AddTaskSection
  const handleAddTask = () => setView('add-task');

  // Handler to go back to HomeSection from AddTaskSection
  const handleBackToHome = () => setView('home');

  // Handler to add a new task
  const handleAddNewTask = (task, dayType = 'today', shouldNavigate = true) => {
    if (dayType === 'today') {
      setTodayTasks(prev => [...prev, { ...task, id: Date.now(), checked: false }]);
    } else {
      setNextdayTasks(prev => [...prev, { ...task, id: Date.now(), checked: false }]);
    }
    if (shouldNavigate) setView('home');
  };

  // Handler to logout/reset app
  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userImagePreview");
    localStorage.removeItem("todayTasks");
    localStorage.removeItem("nextdayTasks");
    setName("");
    setImagePreview("");
    setTodayTasks([]);
    setNextdayTasks([]);
    setView('welcome');
  };

  // Handler to go back to InfoSection (welcome page) from HomeSection
  const handleBackToWelcome = () => {
    if (typeof window !== 'undefined') window.location.hash = '#reset';
    // Do NOT clear name and imagePreview here, just change the view
    setView('welcome');
  };

  if (view === 'welcome') {
    return <InfoSection onComplete={handleWelcomeComplete} />;
  }
  if (view === 'add-task') {
    return <AddTaskSection onBack={handleBackToHome} onAddNewTask={handleAddNewTask} name={name} />;
  }
  // Default: HomeSection
  return <HomeSection name={name} imagePreview={imagePreview} onAddTask={handleAddTask} todayTasks={todayTasks} nextdayTasks={nextdayTasks} setTodayTasks={setTodayTasks} setNextdayTasks={setNextdayTasks} onLogout={handleLogout} onBackToWelcome={handleBackToWelcome} />;
};

export default App;