import { useState, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GoogleLogout } from 'react-google-login'
import { Menu, Transition } from '@headlessui/react'
import { classNames } from '../utils'
import { OAUTH_CLIENT_ID } from '../config'
import { logout } from '../reducer'
import UserExt from './UserExt'

const Users = ({ socket }) => {
  const [users, setUsers] = useState([])
  const dispatch = useDispatch()
  const po = useSelector(store => store.auth.profileObj)
  const { name, imageUrl } = po

  useEffect(() => {
    socket.emit('login', { name, imageUrl }, (response) => {
      setUsers(response)
    })
    socket.on('join', ([id, profile]) => {
      setUsers((u) => ({...u, [id]: profile}))
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
  }, [socket, name, imageUrl])

  const userList = Array.from(Object.entries(users))

  return (
    <>
      <div className="flex -space-x-1">
        {userList.filter(([id]) => id !== socket.id).slice(0, 5).map(([id, { name, imageUrl }], i) => (
          <img
            key={i}
            className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
            src={imageUrl}
            alt={name}
          />
        ))}
        {userList.length > 6 ? <UserExt extra={userList.length - 6} /> : null}
      </div>

      {/* Profile dropdown */}
      <Menu as="div" className="ml-3 relative">
        <div>
          <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
            <span className="sr-only">Open user menu</span>
            <img
              className="h-8 w-8 rounded-full"
              src={imageUrl}
              alt=""
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-30">
            <Menu.Item>
              <GoogleLogout
                clientId={OAUTH_CLIENT_ID}
                onLogoutSuccess={() => dispatch(logout())}
                render={renderProps => (
                  <button
                    onClick={renderProps.onClick}
                    className={classNames(' w-full focus:bg-gray-100 hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700')}
                  >
                    Sign out
                  </button>
                )}
              />
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  )
}

export default Users
