import React, { useEffect, useRef, useState } from 'react'
import CodeEditor from "@monaco-editor/react";
import toast from 'react-hot-toast';
import { ACTIONS } from '../actions/Action';


export default function Editor({socketRef, roomId}) {

    const [codeText, setCodeText] = useState('// write your code')
    const runCode = async()=>{
        // console.log(codeText)
        try {
            await eval(codeText)
        } catch (error) {
           toast.error(error.message)
        }
    }
    useEffect(() => {
    
        // Listen for code changes from other users in the same room
        if(socketRef.current){
            socketRef.current.on(ACTIONS.CODE_CHANGE, (newCode) => {
                console.log('Received code change:', newCode);
                // onCodeChange(newCode)
                setCodeText(newCode)
              });
          
              // Cleanup on component unmount
              
            //   return () => {
            //     socketRef.current.disconnect(); // Disconnect when the component is unmounted
            //   };
        }
        
      });

    const handleCodeChange = (value) => {
        // Update the code and broadcast the change to other users in the room
        setCodeText(value);
        // onCodeChange(value)
        socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code: value });
      };
  return (
    <div>
       <CodeEditor
            height="92vh"
            language="javascript"
            theme="vs-dark"
            value={codeText}
            options={{
                inlineSuggest: true,
                fontSize: "15px",
                formatOnType: true,
                JSON : true,
                autoClosingBrackets: true,
                minimap: { scale: 10 }
            }}
            onChange={(value, event) => {
                handleCodeChange(value);
            }}
        />
        <div className='run-code'>
            <button className='btn runCode' onClick={runCode}>Test Code</button>
        </div>
    </div>
  )
}
