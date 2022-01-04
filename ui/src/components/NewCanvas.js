import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

const NewCanvas = ({ addCanvas }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const closeModal = () => {
    setIsOpen(false)
  }

  const onSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    console.log(e)
    const formData = new FormData(e.target)
    const formProps = Object.fromEntries(formData)
    formProps.height = Number.parseInt(formProps.height)
    formProps.width = Number.parseInt(formProps.width)
    console.log(formProps)
    const response = await fetch('http://localhost:4000/canvas', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formProps)
    })
    setSubmitting(false)
    const data = await response.json()
    if (response.status === 201) {
      closeModal()
      addCanvas(data)
    }
  }

  return (
    <>
    <button type="button" onClick={() => { setIsOpen(true) }} className="shrink-0 px-5 py-3 bg-violet-800 text-gray-100 text-sm font-bold rounded-md hover:bg-violet-700 focus-visible:ring-violet-500">New Canvas</button>
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-medium text-gray-900"
                >
                  Create a new canvas
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Dimensions of the canvas cannot exceed 1000px x 1000px.
                  </p>
                </div>
                <form onSubmit={onSubmit}>
                  <div className="mt-3 grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3 relative">
                        <label htmlFor="height" className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-700">
                          Height
                        </label>
                        <div className="block w-full relative">
                          <input
                            type="number"
                            name="height"
                            id="height"
                            max={1000}
                            maxLength={4}
                            min={1}
                            defaultValue={100}
                            required
                            className="mt-1 pr-8 focus:ring-violet-500 focus:border-violet-500 block w-full shadow-sm sm:text-sm rounded-md"
                          />
                          <span className="absolute inset-y-0 pl-2 h-full right-0 flex items-center pr-2 pointer-events-none rounded-r-md text-sm font-medium text-gray-700">
                            px
                          </span>
                        </div>
                      </div>

                      <div className="col-span-6 sm:col-span-3 relative">
                        <label htmlFor="width" className="block text-sm font-medium text-gray-700 after:content-['*'] after:text-red-700">
                          Width
                        </label>
                        <div className="block w-full relative">
                          <input
                            type="number"
                            name="width"
                            id="width"
                            maxLength={4}
                            max={1000}
                            min={1}
                            defaultValue={100}
                            required
                            className="mt-1 pr-8 focus:ring-violet-500 focus:border-violet-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                          <span className="absolute inset-y-0 pl-2 h-full right-0 flex items-center pr-2 pointer-events-none rounded-r-md text-sm font-medium text-gray-700">
                            px
                          </span>
                        </div>
                      </div>

                      <div className="col-span-6">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="mt-1 focus:ring-violet-500 focus:border-violet-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-violet-900 disabled:text-gray-900 bg-violet-100 disabled:bg-gray-100 border border-transparent rounded-md hover:bg-violet-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500"
                      disabled={submitting}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default NewCanvas
