import React from 'react'

import { useState, useEffect} from 'react';
import { ethers } from "ethers";
import './home.css'
// import { useLocation } from 'react-router-dom'
import Script from "dangerous-html/react";
import { Helmet } from "react-helmet";
import { useAppContext } from '../AppContext'
import { create as ipfsHttpClient } from "ipfs-http-client";
import Papa from 'papaparse';

const projectId = '2WCbZ8YpmuPxUtM6PzbFOfY5k4B';
const projectSecretKey = 'c8b676d8bfe769b19d88d8c77a9bd1e2';
const authorization = "Basic " + btoa(projectId + ":" + projectSecretKey);

const Multiple = () => {
    const { state, setState } = useAppContext() 
    const { provider, signer, contract, account, authenticated } = state;
    console.log(account, authenticated)
    const [file, setFile] = useState();
    const [file_name, setFilename] = useState();
    const [csv_file, setCsv] = useState();
    const [csv_file_name, setCsvname] = useState();
    const [addressData, setAddressData] = useState([]);
    
    // const [uploadedImages, setUploadedImages] = useState();
    // const [Inputname, setName] = useState();
    // const [Inputdesc, setDesc] = useState();
    // const [baseUri, setUri] = useState();
    
    const handlePhotoSelect = (event) => {
        setFile(event.target.files[0]);
        setFilename(event.target.files[0].name);
    };
    const handleCsv = (event) => {
        setCsv(event.target.files[0]);
        setCsvname(event.target.files[0].name);
        Papa.parse(file, {
            complete: (result) => {
              // Assuming the address column is the second column (index 1) in the CSV.
              const addressColumn = result.data.map(row => row[1]);
              setAddressData(addressColumn);
            },
            header: true, // Set to true if your CSV has headers
        });
    }
    const ipfs = ipfsHttpClient({
        url: "https://ipfs.infura.io:5001/api/v0",
        headers: {
          authorization,
        },
    });

    const call = async() => {
        const contractwithsigner = contract.connect(signer)
        const resp = await contractwithsigner.getVal(account)
        console.log(resp)
    } 
    const SendSBT = async(event) => {
        event.preventDefault();
        
        const walletaddress = String(event.target.walletaddress.value);
        const name = String(event.target.name.value);
        const description = String(event.target.description.value);
        //const images = event.target[0].files;
        console.log(walletaddress, name, description);
        // if (!images || images.length === 0) { 
        //     return alert("No files selected");
        // }
        const image = file;
        console.log('uploading...');
        const result = await ipfs.add(image);
        const image_uri = "https://skywalker.infura-ipfs.io/ipfs/"+result.path;
        console.log('file uploaded');
        const updatedJSON = `{
            "name": "${name}",
            "description": "${description}",
            "image": "${image_uri}"
        }`
        console.log(updatedJSON);
        const ans = await ipfs.add(updatedJSON);
        console.log('uploaded data', ans.path);
        const contractwithsigner = contract.connect(signer);
        console.log('connected with contract');
        // Hash the path
        //const hashedPath = crypto.SHA256(ans.path).toString();

        // Convert the hashed path to bytes32
        //const newpath = ethers.utils.formatBytes32String('0x' + hashedPath);
        // Later, when you need the original path
        //const originalPath = crypto.enc.Hex.stringify(crypto.enc.Hex.parse(newpath.substring(2))); // Remove '0x' prefix
        //console.log(originalPath)
        const resp = await contractwithsigner.safeMint(walletaddress, ans.path);
        console.log(resp);


    }
    if (authenticated){
        
        call()
    }
    return (<div>
    {authenticated &&
    <div>
        <div className="home-container">
          <Helmet>
            <title>DeCAT</title>
            <meta property="og:title" content="Dashboard" />
          </Helmet>
          <header data-thq="thq-navbar" className="home-navbar">
            <span className="home-logo">DeCAT</span>
            <div
              data-thq="thq-navbar-nav"
              data-role="Nav"
              className="home-desktop-menu"
            >
              <nav
                data-thq="thq-navbar-nav-links"
                data-role="Nav"
                className="home-nav"
              >
                <button className="home-button button-clean button">About</button>
                <button className="home-button1 button-clean button">
                  Features
                </button>
                <button className="home-button2 button-clean button">
                  Pricing
                </button>
                <button className="home-button3 button-clean button">Team</button>
              </nav>
            </div>
            <div data-thq="thq-navbar-btn-group" className="home-btn-group">
              <div className="home-socials">
                <button className="social button">
                  <img
                    alt="image"
                    src="/Icons/twitter.svg"
                    className="home-image"
                  />
                </button>
                <button className="social button">
                  <img
                    alt="image"
                    src="/Icons/discord.svg"
                    className="home-image01"
                  />
                </button>
              </div>
              {/* <button onClick={!isConnected && connectWallet} className="button">
                {connectmsg}
              </button> */}
              
              
            </div>
            <div data-thq="thq-burger-menu" className="home-burger-menu">
              <button className="button home-button5">
                <svg viewBox="0 0 1024 1024" className="home-icon">
                  <path d="M128 554.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 298.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 810.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667z"></path>
                </svg>
              </button>
            </div>
            <div data-thq="thq-mobile-menu" className="home-mobile-menu">
              <div
                data-thq="thq-mobile-menu-nav"
                data-role="Nav"
                className="home-nav1"
              >
                <div className="home-container1">
                  <span className="home-logo1">DeCAT</span>
                  <div data-thq="thq-close-menu" className="home-menu-close">
                    <svg viewBox="0 0 1024 1024" className="home-icon02">
                      <path d="M810 274l-238 238 238 238-60 60-238-238-238 238-60-60 238-238-238-238 60-60 238 238 238-238z"></path>
                    </svg>
                  </div>
                </div>
                <nav
                  data-thq="thq-mobile-menu-nav-links"
                  data-role="Nav"
                  className="home-nav2"
                >
                  <span className="home-text">About</span>
                  <span className="home-text01">Features</span>
                  <span className="home-text02">Pricing</span>
                  <span className="home-text03">Team</span>
                  <span className="home-text04">Blog</span>
                </nav>
                <div className="home-container2">
                  <button className="home-login button">Login</button>
                  <button className="button">Register</button>
                </div>
              </div>
              <div className="home-icon-group">
                <svg viewBox="0 0 950.8571428571428 1024" className="home-icon04">
                  <path d="M925.714 233.143c-25.143 36.571-56.571 69.143-92.571 95.429 0.571 8 0.571 16 0.571 24 0 244-185.714 525.143-525.143 525.143-104.571 0-201.714-30.286-283.429-82.857 14.857 1.714 29.143 2.286 44.571 2.286 86.286 0 165.714-29.143 229.143-78.857-81.143-1.714-149.143-54.857-172.571-128 11.429 1.714 22.857 2.857 34.857 2.857 16.571 0 33.143-2.286 48.571-6.286-84.571-17.143-148-91.429-148-181.143v-2.286c24.571 13.714 53.143 22.286 83.429 23.429-49.714-33.143-82.286-89.714-82.286-153.714 0-34.286 9.143-65.714 25.143-93.143 90.857 112 227.429 185.143 380.571 193.143-2.857-13.714-4.571-28-4.571-42.286 0-101.714 82.286-184.571 184.571-184.571 53.143 0 101.143 22.286 134.857 58.286 41.714-8 81.714-23.429 117.143-44.571-13.714 42.857-42.857 78.857-81.143 101.714 37.143-4 73.143-14.286 106.286-28.571z"></path>
                </svg>
                <svg viewBox="0 0 877.7142857142857 1024" className="home-icon06">
                  <path d="M585.143 512c0-80.571-65.714-146.286-146.286-146.286s-146.286 65.714-146.286 146.286 65.714 146.286 146.286 146.286 146.286-65.714 146.286-146.286zM664 512c0 124.571-100.571 225.143-225.143 225.143s-225.143-100.571-225.143-225.143 100.571-225.143 225.143-225.143 225.143 100.571 225.143 225.143zM725.714 277.714c0 29.143-23.429 52.571-52.571 52.571s-52.571-23.429-52.571-52.571 23.429-52.571 52.571-52.571 52.571 23.429 52.571 52.571zM438.857 152c-64 0-201.143-5.143-258.857 17.714-20 8-34.857 17.714-50.286 33.143s-25.143 30.286-33.143 50.286c-22.857 57.714-17.714 194.857-17.714 258.857s-5.143 201.143 17.714 258.857c8 20 17.714 34.857 33.143 50.286s30.286 25.143 50.286 33.143c57.714 22.857 194.857 17.714 258.857 17.714s201.143 5.143 258.857-17.714c20-8 34.857-17.714 50.286-33.143s25.143-30.286 33.143-50.286c22.857-57.714 17.714-194.857 17.714-258.857s5.143-201.143-17.714-258.857c-8-20-17.714-34.857-33.143-50.286s-30.286-25.143-50.286-33.143c-57.714-22.857-194.857-17.714-258.857-17.714zM877.714 512c0 60.571 0.571 120.571-2.857 181.143-3.429 70.286-19.429 132.571-70.857 184s-113.714 67.429-184 70.857c-60.571 3.429-120.571 2.857-181.143 2.857s-120.571 0.571-181.143-2.857c-70.286-3.429-132.571-19.429-184-70.857s-67.429-113.714-70.857-184c-3.429-60.571-2.857-120.571-2.857-181.143s-0.571-120.571 2.857-181.143c3.429-70.286 19.429-132.571 70.857-184s113.714-67.429 184-70.857c60.571-3.429 120.571-2.857 181.143-2.857s120.571-0.571 181.143 2.857c70.286 3.429 132.571 19.429 184 70.857s67.429 113.714 70.857 184c3.429 60.571 2.857 120.571 2.857 181.143z"></path>
                </svg>
                <svg viewBox="0 0 602.2582857142856 1024" className="home-icon08">
                  <path d="M548 6.857v150.857h-89.714c-70.286 0-83.429 33.714-83.429 82.286v108h167.429l-22.286 169.143h-145.143v433.714h-174.857v-433.714h-145.714v-169.143h145.714v-124.571c0-144.571 88.571-223.429 217.714-223.429 61.714 0 114.857 4.571 130.286 6.857z"></path>
                </svg>
              </div>
            </div>
          </header>
          {/* {isConnected && <Loginsystem></Loginsystem>} */}
            <form onSubmit={SendSBT}>
              <label className='home-links' style={{color: "white"}}>Wallet Address</label>
              <input type="text" id="walletaddress" style={{width: 300}} className="button"></input>
              <br></br><br></br>
              <label className='home-links' style={{color: "white"}}>Name your Certificate</label>
              <input type="text" id="name" placeholder="Enter Name" style={{width: 300}} className="button"></input>
              <label className='home-links' style={{color: "white"}}>Description</label>
              <input type="text" id="description" placeholder="Enter Description" style={{width: 300}} className="button"></input>
              <label className='home-links' style={{color: "white"}}>Upload Image</label>
              <input type="file" id="image" className='home-button7 button' onChange={handlePhotoSelect}></input>
              <label className='home-links' style={{color: "white"}}>Upload CSV</label>
              <input type="file" id="image" className='home-button7 button' onChange={handleCsv}></input>
              <ul>
                {addressData.map((address, index) => (
                    <li key={index}>{address}</li>
                ))}
              </ul>
              <button type="submit" className='home-button6 button'>Send SBT</button>
             
            </form>
          
          <section className="home-hero">
            <div className="home-heading">
              <h1 className="home-header">Leveraging Modified Soul Bound Tokens</h1>
              <p className="home-caption">
                Decentralized Certificate Authority - A Non Fungible Token based
                Dapp for Certificate Authorization
              </p>
            </div>
            <div className="home-buttons">
              {/* <button onClick={!isConnected && connectWallet} className="button">
                {connectmsg}
              </button> */}
              <button className="home-learn button-clean button">Learn more</button>
            </div>
          </section>
          <section className="home-description">
            <img
              alt="image"
              src="/hero-divider-1500w.png"
              className="home-divider-image"
            />
            <div className="home-container3">
              <div className="home-description01">
                <div className="home-content">
                  <p className="home-paragraph">
                    We are a team of web3 enthusiasts passionate about building
                    Systems that would not only revolutionize the world But also
                    shape the world into a better future.
                  </p>
                  <p className="home-paragraph1">
                    DeCAT is set to release on public blockchain Layer2. The first
                    working model is set to be deployed on Polygon mumbai testnet.
                    Why Polygon? Provides scalability enabling rollup mechanism
                    which plays a critical role in multibatch transactions.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="home-cards">
            <div className="home-row">
              <div className="home-card">
                <div className="home-avatar">
                  <img
                    alt="image"
                    src="/Avatars/avatar.svg"
                    className="home-avatar1"
                  />
                </div>
                <div className="home-main">
                  <div className="home-content01">
                    <h2 className="home-header01">
                      70% of the Certificates are web2 based or paper based
                    </h2>
                    <p className="home-description02">
                      The project aims to tackle the problem of secure credential
                      verification using SoulBound NFTs in a decentralized manner.
                      By creating a Dapp with features for issuers to mint, manage,
                      and verify NFTs, we intend to revolutionize how certificates
                      and achievements are showcased and verified, enhancing their
                      value and authenticity in the digital world.
                    </p>
                  </div>
                  <button className="home-learn1 button">
                    <span className="home-text07">Learn more</span>
                    <img
                      alt="image"
                      src="/Icons/arrow.svg"
                      className="home-image02"
                    />
                  </button>
                </div>
              </div>
              <div className="home-card01">
                <div className="home-avatar2">
                  <img
                    alt="image"
                    src="/Avatars/default-avatar.svg"
                    className="home-avatar3"
                  />
                </div>
                <div className="home-main1">
                  <div className="home-content02">
                    <h2 className="home-header02">
                      DeCAT : provides digital and decentralized certification
                      authority
                    </h2>
                    <p className="home-description03">
                      ensuring the authenticity and uniqueness of certificates,
                      achievements, and credentials has become a critical concern.
                      Traditional methods are susceptible to duplication and
                      tampering, diminishing the value of these accolades. To
                      address this issue, we aim to create a decentralized
                      application (Dapp) that leverages modified ERC721 tokens
                      inspired by SoulBound Tokens.
                    </p>
                  </div>
                  <button className="home-learn2 button">
                    <span className="home-text08">Learn more</span>
                    <img
                      alt="image"
                      src="/Icons/arrow-2.svg"
                      className="home-image03"
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="home-card02">
              <div className="home-avatar4">
                <img
                  alt="image"
                  src="/Avatars/light-avatar.svg"
                  className="home-avatar5"
                />
              </div>
              <div className="home-row1">
                <div className="home-main2">
                  <div className="home-content03">
                    <h2 className="home-header03">
                      Dive Deep into the world of Blockchain
                    </h2>
                    <p className="home-description04">
                      Learn about Rollup mechanism, Layer protocols in Blockchain,
                      Multi batch and bulk transaction processing and many more
                      research things.
                    </p>
                  </div>
                  <button className="home-learn3 button">
                    <span className="home-text09">Learn more</span>
                    <img
                      alt="image"
                      src="/Icons/arrow-2.svg"
                      className="home-image04"
                    />
                  </button>
                </div>
                <img alt="image" src="/group%202262.svg" className="home-image05" />
              </div>
            </div>
          </section>
    
          <footer className="home-footer">
            <div className="home-main5">
              <div className="home-branding">
                <div className="home-heading10">
                  <h2 className="home-logo2">Character</h2>
                  <p className="home-caption17">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore.
                  </p>
                </div>
                <div className="home-socials1">
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="home-twitter1 social button"
                  >
                    <img
                      alt="image"
                      src="/Icons/twitter.svg"
                      className="home-image32"
                    />
                  </a>
                  <a
                    href="https://discord.com"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="home-discord1 social button"
                  >
                    <img
                      alt="image"
                      src="/Icons/discord.svg"
                      className="home-image33"
                    />
                  </a>
                </div>
              </div>
              <div className="home-links1">
                <div className="home-list1">
                  <h3 className="home-heading11">Site</h3>
                  <div className="home-items">
                    <button className="home-link02 button-clean button">
                      About
                    </button>
                    <button className="home-link03 button-clean button">
                      Collection
                    </button>
                    <button className="home-link04 button-clean button">
                      Roadmap
                    </button>
                    <button className="home-link05 button-clean button">
                      Features
                    </button>
                  </div>
                </div>
                <div className="home-list2">
                  <h3 className="home-heading12">Company</h3>
                  <div className="home-items1">
                    <button className="home-link06 button-clean button">
                      Team
                    </button>
                    <button className="home-link07 button-clean button">
                      Press
                    </button>
                    <button className="home-link08 button-clean button">
                      Terms
                    </button>
                    <button className="home-link09 button-clean button">
                      Limitations
                    </button>
                    <button className="home-link10 button-clean button">
                      Licenses
                    </button>
                  </div>
                </div>
              </div>
              <div className="home-socials2">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="home-twitter2 social button"
                >
                  <img
                    alt="image"
                    src="/Icons/twitter.svg"
                    className="home-image34"
                  />
                </a>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="home-discord2 social button"
                >
                  <img
                    alt="image"
                    src="/Icons/discord.svg"
                    className="home-image35"
                  />
                </a>
              </div>
            </div>
            <span className="home-copyright">
              © 2022 Character. All Rights Reserved.
            </span>
          </footer>
        </div>
      );</div>
    }
    {!authenticated && 
    <div>Please authenticate yourself</div>
    }
    </div>
    )
}
export default Multiple;