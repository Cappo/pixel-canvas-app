import { useState } from 'react'
import { DotsHorizontalIcon } from '@heroicons/react/outline'
import { classNames } from '../utils'

const UserExt = ( { extra }) => {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <button
        type="button"
        className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-white"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        <span className="sr-only">...and {extra} others</span>
        <DotsHorizontalIcon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div
        aria-hidden="true"
        className={
          classNames(
            "bg-slate-900 max-w-xs shadow-lg w-fit block text-center no-underline text-sm rounded-md text-gray-300 absolute z-50 px-5 py-2 -bottom-5",
            visible ? 'scale-1' : 'scale-0',
            'transition ease-out duration-250'
          )
        }
      >
        ...and {extra} others
      </div>
    </>
  )
}

export default UserExt
