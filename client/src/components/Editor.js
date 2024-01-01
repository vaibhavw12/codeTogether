import React, { useEffect, useRef, useState } from 'react'
import CodeEditor from "@monaco-editor/react";
import toast from 'react-hot-toast';


export default function Editor() {

    const [codeText, setCodeText] = useState('// write your code')
    // useEffect(()=>{
    //     // async function init() {
    //     //     codeMirror.fromTextArea(document.getElementById('realtimeEditor'),{

    //     //     })
    //     // }
    //     // init()
    //     // console.log(outputText)
    // },[])
    const runCode = async()=>{
        // console.log(codeText)
        try {
            await eval(codeText)
        } catch (error) {
           toast.error(error.message)
        }
    }
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
                setCodeText(value);
            }}
        />
        <div className='run-code'>
            <button className='btn runCode' onClick={runCode}>Test Code</button>
        </div>
    </div>
  )
}
