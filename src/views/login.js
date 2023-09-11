import React from 'react'

import Script from 'dangerous-html/react'
import { Helmet } from 'react-helmet'
import { useState, useEffect} from 'react'
import './home.css'

const Loginsystem = (props) => {
    const {state} = props;
    const {account} = state;
    const [authorized, setAuth] = useState(0);
    const SignIn = async(event) => {
        event.preventDefault();
        const {contract} = state;
        const {signer} = state;
        const walletAddress = document.querySelector('#walletaddress').value;
        const password = document.querySelector('#password').value;
        console.log(contract, password, walletAddress);
        const contractwithsigner = contract.connect(signer);
        const resp = await contractwithsigner.getVal(walletAddress);
        if(resp == password){setAuth(1);}
        else{setAuth(2)}
    };
    return (<div>
    {authorized == 1 && 
    <div data-thq="thq-close-menu" className="home-caption01">Wohooo!! You are Logged In
    </div>
    }

    {authorized == 2 && 
    <div data-thq="thq-close-menu" className="home-caption01">Wrong credentials
    </div>
    }
    <br></br>
    <form onSubmit={SignIn}>
         <label className='home-links' style={{color: "white"}}>Wallet Address</label>
         <input type="url" id="walletaddress" value={account ? account[0]: ""} disabled style={{width: 300}} className="button"></input>
         <br></br><br></br>
         <label className='home-links' style={{color: "white"}}>Enter Password</label>
         <input type="password" id="password" placeholder="Enter Your Password" className='home-button7 button'></input>

         <button type="submit" className='home-button6 button'>Login</button>
        
     </form>
    </div>
    )
}
export default Loginsystem;