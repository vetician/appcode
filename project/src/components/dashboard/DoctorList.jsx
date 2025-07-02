import { useSelector } from 'react-redux'
import DoctorCard from './DoctorCard'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { Loader2, AlertCircle } from 'lucide-react'

const DoctorList = ({ activeTab, loading, error }) => {
  const { verifiedDoctors, unverifiedDoctors } = useSelector(state => state.doctors)

  const getDoctorsToShow = () => {
    switch (activeTab) {
      case 'verified':
        return verifiedDoctors
      case 'unverified':
        return unverifiedDoctors
      case 'overview':
        return [...verifiedDoctors, ...unverifiedDoctors]
      default:
        return []
    }
  }

  const getTitle = () => {
    switch (activeTab) {
      case 'verified':
        return 'Verified Doctors'
      case 'unverified':
        return 'Unverified Doctors'
      case 'overview':
        return 'All Doctors'
      default:
        return 'Doctors'
    }
  }

  const doctors = getDoctorsToShow()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Loading doctors...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading doctors: {error}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{getTitle()}</h2>
        <p className="text-gray-600 mt-1">
          {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} found
        </p>
      </div>
      
      {doctors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No doctors found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorList