import { useState, useEffect } from 'react'
import { randomName, emoji } from '../utils'
import FloatingBox from './FloatingBox'
import './Users.css'

const Users = ({ socket }) => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    socket.emit('login', randomName, (response) => {
      console.log('login', response)
      setUsers(response)
    })
    socket.on('join', (name) => {
      setUsers((u) => [...u, name])
    })

    socket.on('leave', (name) => {
      setUsers((u) => u.filter((user) => user !== name))
    })

    return () => {
      socket.emit('logout', randomName)
    }
  }, [socket])

  return (
    <FloatingBox right="10px" top="10px">
      <ul className="user-list">
        {users.slice(0, 5).map((u, i) => (
          <li key={i} data-content={emoji[u.split('-')[1]] + ' '}>
            {u}
            {u === randomName ? ' (you)' : ''}
          </li>
        ))}
        {users.length > 5 ? <li>{`...and ${users.length - 5} others`}</li> : null}
      </ul>
    </FloatingBox>
  )
}

export default Users
