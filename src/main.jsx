import React from "react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import AddTaskSection from "./components/AddTaskSection.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <HomeSection/> */}
    {/* <AddTaskSection/> */}
    <App />
  </StrictMode>,
)
