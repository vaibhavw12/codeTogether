import React, { useEffect, useRef, useState } from 'react'
import logo from '../assets/exchange.png'
import toast from 'react-hot-toast';
import Client from '../components/Client'
import Editor from '../components/Editor'
import { initSocket } from '../socket'
import { ACTIONS } from '../actions/Action'
import { useLocation, useNavigate, useParams } from 'react-router-dom'


export default function Edit() {

    const location = useLocation()
    const socketRef = useRef(null)
    const { roomId } = useParams();
    const codeRef = useRef(null)
    const reactNavigator = useNavigate();

    const [clientsList, setClients] = useState([])
    // {socketId : 1, userName : 'vaibhav wable'},
    // {socketId : 2, userName : 'raj deore'},
    // {socketId : 3, userName : 'vinit mangate'}

    useEffect(()=>{
        const init = async()=>{
            socketRef.current = await initSocket()
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));
            
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            // Listening for joined event
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    console.log(clients)
                    // socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    //     code: codeRef.current,
                    //     socketId,
                    // });
                }
            );

            // Listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        }
        init()
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    },[])
    function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');
    }
    
    async function copyRommId (){
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }

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
                    {clientsList.map((client, index)=>(
                        <Client key={index} id={client.socketId} userName={client.username}/>
                    ))}
                </div>
            </div>
            <button onClick={copyRommId} className='btn copyBtn'>Copy Room Id</button>
            <button onClick={leaveRoom} className='btn leaveBtn'>Leave</button>
        </div>
        <div className='editorWrap'>
            <Editor socketRef={socketRef} roomId={roomId}  
                        // onCodeChange={(code) => {
                        // codeRef.current = code;}}
            />
        </div>
    </div>
  )
}
