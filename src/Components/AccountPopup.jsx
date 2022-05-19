import React from 'react'

function AccountPopup() {
  return (
    <div className='accountPopup'>
    <div className='loginDiv'>
        <h1>Login</h1>
        <form>
            <label>Username: </label>
            <input type='text' /><br/>

            <label>Password: </label>
            <input type='password' /><br />

            <button type='submit'>Login</button>
        </form>
    </div>

    <div className='registerDiv'><h1>Register</h1>
    <form>
        <label>First name: </label>
            <input type='text' />
        <br/>

        <label>Last name: </label>
            <input type='text' />
        <br/>

        <label>Username: </label>
            <input type='text' />
        <br/><br/>

        <label>Password:
            <input type='password' />
        </label><br />
        <label>Confirm password:
            <input type='password' />
        </label><br/>
        <button type='submit'>Register</button>
        <a href=''>Forgot Password?</a>
    </form>
    </div>

    </div>
  )
}

export default AccountPopup