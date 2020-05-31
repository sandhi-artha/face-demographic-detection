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
            <div className="back-arrow">
                <img className="btn" src="https://img.icons8.com/nolan/64/arrow-pointing-left.png"
                width="30px" height="30px" alt="back" onClick={()=>onRouteChange("signin")}/>
                <p>Back</p>
            </div>
            <div className='content-register'>
                <h1>Register</h1>
                <label htmlFor="register-name">Name</label>
                <input type="text" name="name" id="register-name" placeholder="make up a name"/>
                <label htmlFor="register-email">Email</label>
                <input type="email" name="email-address" id="register-email" placeholder="make up any email"/>
                <label htmlFor="register-pass">Password</label>
                <input type="password" name="pass" id="register-pass" placeholder="make up any password"/>
                <input className="btn-register" type="submit" value="Register" onClick={() => onSubmitRegister(onRouteChange, updateUser, server)}/>
            </div>
        </div>
    )
}

export default Register;