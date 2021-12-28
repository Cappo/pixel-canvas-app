import { useState } from 'react'
import { DotsHorizontalIcon } from '@heroicons/react/outline'

const UserExt = ( { extra }) => {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <button
        type="button"
        className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-white"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        <span className="sr-only">...and {extra} others</span>
        <DotsHorizontalIcon className="h-6 w-6" aria-hidden="true" />
      </button>
      {visible && <div aria-hidden="true" className="bg-slate-900 max-w-xs shadow-lg block text-center no-underline text-sm rounded-md text-gray-300 absolute z-50 px-5 py-2 -bottom-10">...and {extra} others</div>}
    </>
  )
}

export default UserExt
