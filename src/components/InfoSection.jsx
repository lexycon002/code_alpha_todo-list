import React, { useState, useRef, useEffect } from 'react';
import { FaArrowRight } from "react-icons/fa";

const InfoSection = ({ onComplete }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState();
  const [imagePreview, setImagePreview] = useState("");
  const inputRef = useRef(null);

  // Date formatting
  function formatDate(n) {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }
  const date = new Date();
  const day = date.getDate();
  const monthName = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#reset') {
      setName("");
      setImage(null);
      setImagePreview("");
      setError(undefined);
      window.location.hash = '';
    }
  }, [window.location.hash]);

  useEffect(() => {
    // If user info exists in localStorage, prefill the form
    const savedName = localStorage.getItem("userName");
    const savedImage = localStorage.getItem("userImagePreview");
    if (savedName) setName(savedName);
    if (savedImage) setImagePreview(savedImage);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleProceed = (e) => {
    e.preventDefault();
    if (name && image) {
      if (onComplete) onComplete(name, image); // pass File, not blob URL
    } else {
      setError("Please enter your name and select an image.");
    }
  };

  return (
    <div className="container">
      <div className="date-container">
        <p>Hi, Today is {formatDate(day)} of {monthName}, {year}</p>
      </div>
      <form className="name-container" onSubmit={handleProceed}>
        <div className="image-container" onClick={() => inputRef.current && inputRef.current.click()} style={{ cursor: 'pointer' }}>
          {imagePreview && image ? (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <div style={{ width: 150, height: 150, borderRadius: '50%', border: '1px solid rgba(2, 80, 2, 0.918)', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 18 }}>
              Click to select image
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
            ref={inputRef}
          />
        </div>
        <input className="name-holder" type="text" placeholder='Please Enter Your Name' value={name} onChange={handleNameChange} />
        <div style={{ minHeight: 18 }}>
          {error && <p className="error">{error}</p>}
        </div>
        <button className="submit-btn " type="submit">
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            Proceed
            <FaArrowRight className="submit-icon" />
          </span>
        </button>
      </form>
    </div>
  );
}

export default InfoSection;
