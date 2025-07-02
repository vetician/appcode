import { useSelector } from 'react-redux'
import { Card } from '../../../components/ui/card'
import { Bell, Search, User } from 'lucide-react'

const Header = () => {
  const { user } = useSelector(state => state.auth)
  const { verifiedDoctors, unverifiedDoctors } = useSelector(state => state.doctors)

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-10 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">Doctor Management</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4">
            <Card className="px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Verified: {verifiedDoctors.length}</span>
              </div>
            </Card>
            <Card className="px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium">Pending: {unverifiedDoctors.length}</span>
              </div>
            </Card>
          </div>
          
          <div className="flex items-center space-x-3">
            <Bell className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-800" />
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600 mr-3" />
              <span className="text-sm font-medium text-gray-700">
                {user?.name || 'Admin'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header