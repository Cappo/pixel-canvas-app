import { useSelector } from "react-redux"
import Toast from './Toast'

const ToastContainer = () => {
  const notifications = useSelector(store => store.notifications)

  return (
    <div className=" absolute right-0 bottom-0 m-4 z-50 transition-transform duration-1000 ease-in-out">
      {notifications.map((toast, i) => (
        <Toast key={i} toast={toast} />
      ))}
    </div>
  )
}

export default ToastContainer
