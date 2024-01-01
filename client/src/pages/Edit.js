import React, { useState } from 'react'
import logo from '../assets/exchange.png'
import Client from '../components/Client'
import Editor from '../components/Editor'

export default function Edit() {

    const [clients, setClients] = useState([{socketId : 1, userName : 'vaibhav wable'},
                                            {socketId : 2, userName : 'raj deore'},
                                            {socketId : 3, userName : 'vinit mangate'}])
  return (
    <div className='mainWrap'>
        <div className='aside'>
            <div className='asideInner'>
                <div className='logo'>
                    <img
                        className="logoImage"
                        src={logo}
                        alt="home-page-logo"
                    />
                    <p className='logoText'>Let's code <br /> Together</p>
                </div>
                <h3>Connected</h3>
                <div className='clientsList'>
                    {clients.map((client, index)=>(
                        <Client key={index} id={client.socketId} userName={client.userName}/>
                    ))}
                </div>
            </div>
            <button className='btn copyBtn'>Copy Room Id</button>
            <button className='btn leaveBtn'>Leave</button>
        </div>
        <div className='editorWrap'>
            <Editor />
        </div>
    </div>
  )
}
