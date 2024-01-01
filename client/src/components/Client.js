import React from 'react'
import Avatar from 'react-avatar'

export default function Client(props) {
  return (
    <div className='client'>
        <Avatar name={props.userName} size={50} round='14px'/>
        <span className='userName'>{props.userName}</span>
    </div>
  )
}
