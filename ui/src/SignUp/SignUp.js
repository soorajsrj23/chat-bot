import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, FormGroup, Label } from 'reactstrap';

import './SignUp.css'
import { toast } from 'react-toastify';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSignup = () => {
    if (name && email && password && selectedFile) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('image', selectedFile);
    
      axios
        .post('http://localhost:4000/signup', formData)
        .then((response) => {
          console.log(response.data);
          // Reset form fields
          setName('');
          setEmail('');
          setPassword('');
          setSelectedFile(null);
          // Navigate to the next page
          toast.success('User registered successfully');
      
          navigate('/login');
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.message);
        });
    } else {
      toast.error('Please fill in all the fields');
    }
  };

  const moveTologin = () => {
    navigate('/login')
  }

  return (
    <div className="signup-container">
      <Container className="h-100">
        <Row className="h-100 justify-content-center align-items-center">
          <Col md="4" className="mx-auto">
            <div className="signup-form p-4">
              <div className="icon-wrapper">
                {selectedFile ? (
                  <div className="selected-image-wrapper">
                    <img src={URL.createObjectURL(selectedFile)} alt="Selected" className="selected-image" />
                  </div>
                ) : (
                  <div className='add_icon'>
                    <i className="bi bi-person-bounding-box"></i>
                  </div>
                )}
                <label htmlFor="fileInput" className="fileInputLabel">
                  <input type="file" id="fileInput" className="fileInput" onChange={handleFileSelect} />
                  <p className='text-light'>select Image</p>
                </label>
              </div>
              
              <h3 className="sign-up_head">Sign Up</h3>
              <FormGroup>
                <Label for="name" className="inputsFieldName">
                  Name
                </Label>
                <br />
                <input type="text" id="name" className="dark" value={name} onChange={(e) => setName(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label for="email" className="inputsFieldName">
                  Email
                </Label>
                <br />
                <input type="email" id="email" className="dark" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label for="password" className="inputsFieldName">
                  Password
                </Label>
                <br />
                <input type="password" id="password" className="dark" value={password} onChange={(e) => setPassword(e.target.value)} />
              </FormGroup>
              <center>
                <button type="button" className="btn btn-outline-light" onClick={handleSignup}>
                  Sign Up
                </button>
                <p>Already have an account <u onClick={moveTologin}>login</u></p>
              </center>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignUp;
