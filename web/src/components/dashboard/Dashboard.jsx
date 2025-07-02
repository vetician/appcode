import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import DoctorList from './DoctorList'
import { fetchDoctorsStart, fetchVerifiedDoctorsSuccess, fetchUnverifiedDoctorsSuccess, fetchDoctorsFailure } from '../../store/slices/doctorSlice'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const { loading, error } = useSelector(state => state.doctors)
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    // Set active tab based on current route
    if (location.pathname === '/verified-doctors') {
      setActiveTab('verified')
    } else if (location.pathname === '/unverified-doctors') {
      setActiveTab('unverified')
    } else {
      setActiveTab('overview')
    }
  }, [location.pathname])

  useEffect(() => {
    fetchDoctors()
  }, [activeTab])

  const fetchDoctors = async () => {
    dispatch(fetchDoctorsStart())
    
    try {
      if (activeTab === 'verified' || activeTab === 'overview') {
        // Fetch verified doctors
        const verifiedResponse = await fetch('http://localhost:3000/api/auth/admin/verified', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (verifiedResponse.ok) {
          const verifiedData = await verifiedResponse.json()
          console.log("Fetched Verified Data => ", verifiedData)
          dispatch(fetchVerifiedDoctorsSuccess(verifiedData.veterinarians || []))
        }
      }
      
      if (activeTab === 'unverified' || activeTab === 'overview') {
        // Fetch unverified doctors
        const unverifiedResponse = await fetch('http://localhost:3000/api/auth/admin/unverified', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (unverifiedResponse.ok) {
          const unverifiedData = await unverifiedResponse.json()
          console.log("Fetched Unverified Data => ", unverifiedData)
          dispatch(fetchUnverifiedDoctorsSuccess(unverifiedData.veterinarians || []))
        }
      }
    } catch (error) {
      dispatch(fetchDoctorsFailure(error.message))
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 gap-2">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <DoctorList activeTab={activeTab} loading={loading} error={error} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
