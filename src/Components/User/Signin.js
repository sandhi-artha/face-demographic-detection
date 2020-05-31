import React from 'react';
import './Signin.css';

const onSubmitSignIn = (onRouteChange, updateUser, server) => {
    const email = document.getElementById("signin-email").value;
    const password = document.getElementById("signin-pass").value;
    fetch(server+'signin', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password })
    })
    .then(resp => resp.json())
    .then(data => {
        if (data.profile){       // means if the data has a profile property, differentiating from the error message
            console.log(data);
            updateUser(data);
            onRouteChange('content');
            document.querySelector('.nav').classList.remove('hidden');  // if successfully signin, show the signout nav
        }
    })
}

const Signin = ({onRouteChange, updateUser, server}) => {
    return (
        <div className='Signin'>
            <h1>Sign In</h1>
            <label htmlFor="signin-email">Email</label>
            <input type="email" name="signin-email" id="signin-email"/>
            <label htmlFor="signin-pass">Password</label>
            <input type="password" name="signin-pass" id="signin-pass"/>
            <input className="submit" type="submit" value="Sign In" onClick={() => onSubmitSignIn(onRouteChange, updateUser, server)}/>
            <input className="btn-register" type="submit" value="Register" onClick={() => onRouteChange('register')}/>
        </div>
    )
}

export default Signin;