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
      setUsers(response)
    })
    socket.on('join', ([id, name]) => {
      setUsers((u) => ({...u, [id]: name}))
    })

    socket.on('leave', (id) => {
      setUsers((u) => {
        const newUsers = {
          ...u,
        }
        delete newUsers[id]
        return newUsers
      })
    })

    return () => {
      socket.emit('logout', name)
    }
  }, [socket, name])

  const userList = Array.from(Object.entries(users))
  return (
    <FloatingBox right="10px" top="10px">
      <ul className="user-list">
        {userList.slice(0, 5).map(([id, name], i) => (
          <li key={i} data-content={'👋' + ' '}>
            {name}
            {id === socket.id ? ' (you)' : ''}
          </li>
        ))}
        {userList.length > 5 ? <li>{`...and ${userList.length - 5} others`}</li> : null}
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
