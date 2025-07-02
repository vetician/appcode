'use client';

import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { ChevronRight } from 'lucide-react';

const DoctorListItem = ({ doctor, onClick }) => {
  const getFieldValue = (field) => field?.value || field || 'Not provided';
  const getInitials = (name) => {
    const nameStr = typeof name === 'string' ? name : name?.value || '';
    return nameStr.charAt(0) || 'D';
  };

  return (
    <div 
      onClick={onClick}
      className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <Avatar className="h-12 w-12 mr-4">
        <AvatarImage src={getFieldValue(doctor.profilePhotoUrl)} />
        <AvatarFallback className="bg-blue-50 text-blue-600">
          {getInitials(doctor.name)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">
          {getFieldValue(doctor.title)} {getFieldValue(doctor.name)}
        </h3>
        <p className="text-sm text-gray-600 truncate">
          {getFieldValue(doctor.specialization)}
        </p>
      </div>
      
      <div className="flex items-center ml-4">
        <Badge variant={doctor.isVerified ? "default" : "secondary"} className="mr-2">
          {doctor.isVerified ? 'Verified' : 'Pending'}
        </Badge>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};

export default DoctorListItem;