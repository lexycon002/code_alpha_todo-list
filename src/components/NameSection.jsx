import React from 'react'


  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState()
  const [showHome, setShowHome] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const inputRef = useRef(null);

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
      setShowHome(true);
    } else {
      setError("Please enter your name and select an image.");
    }
  };
const NameSection = () => {
  return (
    <div>
         <form className="name-container" onSubmit={handleProceed}>
        <div className="image-container">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              onClick={() => inputRef.current && inputRef.current.click()}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <img
              alt=""
              onClick={() => inputRef.current && inputRef.current.click()}
              style={{ cursor: 'pointer' }}
            />
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
        <button className="submit-btn" type="submit">
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            Proceed
            <FaArrowRight className="submit-icon" />
          </span>
        </button>
      </form>
    </div>
  )
}

export default NameSection