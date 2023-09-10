import React from 'react'

import Script from 'dangerous-html/react'
import { Helmet } from 'react-helmet'

import './home.css'

const Loginsystem = (state) => {
    const {account} = state;
    const SignIn = async(event) => {
        event.preventDefault();
        const {contract} = state;
        const walletAddress = document.querySelector('#walletaddress').value;
        const password = document.querySelector('#password').value;
        console.log(contract, password, walletAddress);
    };
    return (<div>
    <form onSubmit={SignIn}>
         <label>Wallet Address</label>
         <input type="url" id="walletaddress" value={account[0]} disabled style={{width: 300}}></input>
         <label>Enter Password</label>
         <input type="password" id="password" placeholder="Enter Your Password"></input>

         <button type="submit">Login</button>
        
     </form>
    </div>
    )
}
export default Loginsystem;