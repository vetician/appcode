import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { Button } from '../../../components/ui/button'
import { Home, UserCheck, UserX, LogOut, Stethoscope } from 'lucide-react'

const Sidebar = ({ activeTab, setActiveTab }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/signin')
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home, path: '/dashboard' },
    { id: 'verified', label: 'Verified Doctors', icon: UserCheck, path: '/verified-doctors' },
    { id: 'unverified', label: 'Unverified Doctors', icon: UserX, path: '/unverified-doctors' },
  ]

  return (
    <div className="flex flex-col w-64 h-full bg-white shadow-xl border-r border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-center h-20 bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="flex items-center space-x-3">
          <Stethoscope className="h-7 w-7 text-white" />
          <span className="text-xl font-bold text-white tracking-tight">Admin Panel</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${activeTab === item.id ? 'stroke-[2.5]' : ''}`} />
                  <span className="text-sm">{item.label}</span>
                  {activeTab === item.id && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full flex items-center space-x-2 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">Logout</span>
        </Button>
      </div>
    </div>
  )
}

export default Sidebar