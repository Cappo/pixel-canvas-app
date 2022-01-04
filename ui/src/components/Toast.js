import { useState } from "react"
import { CheckCircleIcon, ExclamationCircleIcon, QuestionMarkCircleIcon } from "@heroicons/react/outline"
import { classNames } from "../utils"
import { useEffect } from "react"
import { unnotify } from "../reducer"
import { useDispatch } from "react-redux"

const Toast = ({ toast }) => {
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()
  useEffect(() => {
    setVisible(true)
  }, [])
  useEffect(() => {
    setTimeout(() => {
      setVisible(false)
      setTimeout(() => {
        dispatch(unnotify(toast.id))
      }, 1000)
    }, 4000)
  }, [dispatch, toast.id])

  const icon = {
    Success: <CheckCircleIcon className="stroke-green-400 h-6 w-6" />,
    Error: <ExclamationCircleIcon className=" stroke-red-400 h-6 w-6" />
  }
  return (
    <div className={classNames("p-4 bg-white rounded-md shadow-xl flex w-80 mt-4 transition-all duration-1000 overflow-hidden ease-in-out", visible ? 'opacity-100' : 'opacity-0')}>
      <div className="pr-2">
        { icon[toast.appearance] || <QuestionMarkCircleIcon className="stroke-yellow-400 h-6 w-6" /> }
      </div>
      <div className="flex-grow pr-2">
        <h3 className="font-bold text-">{toast.appearance}</h3>
        <span className="text- text-gray-500">{toast.message}</span>
      </div>
    </div>
  )
}

export default Toast
