import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GoogleLogout } from 'react-google-login'
import FloatingBox from './FloatingBox'
import { OAUTH_CLIENT_ID } from '../config'
import { logout } from '../reducer'
import './Users.css'

const Users = ({ socket }) => {
  const [users, setUsers] = useState([])
  const dispatch = useDispatch()
  const name = useSelector(store => store.auth.profileObj.name)

  useEffect(() => {
    socket.emit('login', name, (response) => {
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
      socket.emit('logout', name)
    }
  }, [socket, name])

  return (
    <FloatingBox right="10px" top="10px">
      <ul className="user-list">
        {users.slice(0, 5).map((u, i) => (
          <li key={i} data-content={'👋' + ' '}>
            {u}
            {u === name ? ' (you)' : ''}
          </li>
        ))}
        {users.length > 5 ? <li>{`...and ${users.length - 5} others`}</li> : null}
      </ul>
      <GoogleLogout
        clientId={OAUTH_CLIENT_ID}
        buttonText="Logout"
        onLogoutSuccess={() => dispatch(logout())}
      />
    </FloatingBox>
  )
}

export default Users
