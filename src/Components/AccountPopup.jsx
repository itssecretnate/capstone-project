import React, {useEffect, useState} from 'react'
import { useCookies } from 'react-cookie';

function AccountPopup(props) {

    const {display, setLoggedIn} = props;

    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(!showRegister);
    const [showPopup, setShowPopup] = useState(!display);

    const [cookies, setCookie] = useCookies(["username"]);

    const [username, setUsername] = useState('');

    function setUsernameCookie() {
        setCookie("username", username, {
        path: "/"
        });
    }

    useEffect(() => {
        setShowPopup(display);
    }, [display])


    const tradeFields = (e) => {
        if(e) e.preventDefault();

        setShowRegister(!showRegister);
        setShowLogin(!showLogin);
    }

  return (
    <div className='accountPopup' hidden={!showPopup}>

        <h2 id='closePopup' onClick={e => setShowPopup(!showPopup)}>X</h2>

    <div className='loginContainer'>
        <div id='register' className='loginForm' hidden={!showRegister}>
            <h3>Register</h3>
            <form id='registerForm' onSubmit={e => alert('Account registered succesfully!')}>
                <input type="text" placeholder="Username" maxlength="16" id="username" />
                <input type="text" placeholder="First Name" id="firstName" />
                <input type="text" placeholder="Last Name" id="lastName" />
                <input type="text" placeholder="Email" id="email" />
                <input type="password" placeholder="Password" maxlength="" id="password" />
                <input type="password" placeholder="Confirm Password" maxlength="" id="confirmPassword" />
                <input type="submit" value="Register" id="registerSubmit" />
            </form>
            <p onClick={tradeFields}>Already have an account? Login!</p>
        </div>

        <div id='login' className='loginForm' hidden={!showLogin}>
            <h3>Login</h3>
            <form id='loginDetailsForm' onSubmit={e => {
                setUsernameCookie()
                setLoggedIn(true)
                }}>
                <input type="text" placeholder="Username" maxlength="16" id="username" onChange={e => setUsername(e.target.value)}/>
                <input type="password" placeholder="Password" maxlength="" id="password" />
                <input type="submit" value="Login" id="loginSubmit" />
            </form>
            <p onClick={tradeFields}>Need an account? Register!</p>
        </div>



    </div>
    

    </div>
  )
}

export default AccountPopup