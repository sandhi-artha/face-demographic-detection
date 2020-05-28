import React from 'react';
import './Register.css';

const onSubmitRegister = (onRouteChange, updateUser, server) => {
    const name = document.getElementById("register-name").value
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-pass").value;
    fetch(server+'register', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name, email, password })
    })
    .then(resp => resp.json())
    .then(data => {
        if (data.name){
            updateUser(data);
            onRouteChange('content');
            document.querySelector('.nav').classList.remove('hidden');  // if successfully registered, show the signout nav
        }
    })
  }

const Register = ({onRouteChange, updateUser, server}) => {
    return (
        <div className='register'>
            <h1>Register</h1>
            <label htmlFor="register-name">Name</label>
            <input type="text" name="name" id="register-name"/>
            <label htmlFor="register-email">Email</label>
            <input type="email" name="email-address" id="register-email"/>
            <label htmlFor="register-pass">Password</label>
            <input type="password" name="pass" id="register-pass"/>
            <input className="register" type="submit" value="Register" onClick={() => onSubmitRegister(onRouteChange, updateUser, server)}/>
        </div>
    )
}

export default Register;