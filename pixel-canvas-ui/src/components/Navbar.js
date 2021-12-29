import Users from './Users'

const Navbar = ({ socket, name }) => {
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="block h-8 w-auto"
                src="https://www.svgrepo.com/show/275959/space-invaders.svg"
                alt="Pixel Canvas App"
              />
            </div>
            <div className="sm:block ml-6">
              <h1 className="text-center text-2xl font-extrabold rounded-md text-gray-300">{name}</h1>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <Users socket={socket} />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
