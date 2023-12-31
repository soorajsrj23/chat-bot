import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditProfile.css';
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';
const EditProfile = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [fetchedImage, setFetchedImage] = useState('');

  useEffect(() => {
    // Fetch user profile data
    axios
      .get('http://localhost:4000/current-user', {
        headers: {
          Authorization: localStorage.getItem('token'), // Send the JWT token for authentication
        },
      })
      .then((response) => {
        const { email, name, image } = response.data;
        setEmail(email);
        setName(name);
        if (image && image.data && image.contentType) {
          const base64Image = `data:${image.contentType};base64,${image.data}`;
          setFetchedImage(base64Image);
        }
      })
      .catch((error) => {
        console.error(error);
        // Handle error
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('name', name);
   
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.put('http://localhost:4000/edit-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('token'), // Send the JWT token for authentication
        },
      });

      console.log(response.data);
      // Handle successful update
      toast.success("profile updated successfully");
    } catch (error) {
      console.error(error);
     toast.error(error);
      // Handle error
    }
  };

  const handleChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    setFetchedImage(URL.createObjectURL(selectedImage));
  };

  return (
    <div className='parent-edit-profile'>
      <h3 className='form_header'>Edit Profile</h3>
    <form className="dark-theme-form"  onSubmit={handleSubmit}>
    
     <div>
    {fetchedImage && (
      <div className='image-container'>
        <img src={fetchedImage} className='imageIn_circle' alt="Fetched" width="100" />
        <label htmlFor="file-input" className="file-input-label">
          <div className="file-icon" >
          <i className="bi bi-plus-circle-fill" style={{ fontSize: '34px'}}></i>
          </div>
          <input id="file-input" type="file" className='file-input' onChange={handleChange} />
        </label>
      </div>
    )}
  </div>
                

  <div className='form-group'>
        <label>Name:</label>
        <br/>
        <input type="text" className='darkInputs' value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div  className='form-group'>
        <label>Email:</label>
        <br/>
      
        <input type="email" value={email} className='darkInputs' onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div  className='form-group'>
       <br/>
      
        <label>Password:</label>
        <input type="password" className='darkInputs' value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      
      <br/>
      <div  className='form-group'>
      <Button className='edit_profile_button' type="submit">Update Profile</Button>
      </div>
    </form>
    </div>
  );
};

export default EditProfile;
