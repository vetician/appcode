'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyDoctorFieldAPI } from '../../store/slices/doctorSlice';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Checkbox } from '../../../components/ui/checkbox';
import { Badge } from '../../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Separator } from '../../../components/ui/separator';
import { MapPin, Stethoscope, GraduationCap, FileText, Users, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const DoctorCard = ({ doctor }) => {
  const [localVerifiedState, setLocalVerifiedState] = useState({});
  const dispatch = useDispatch();
  const { verifyingField } = useSelector(state => state.doctors);

  const handleVerifyField = async (fieldName, isCurrentlyVerified) => {
    if (!isCurrentlyVerified) {
      try {
        setLocalVerifiedState(prev => ({
          ...prev,
          [fieldName]: true
        }));

        await dispatch(
          verifyDoctorFieldAPI({
            doctorId: doctor._id,
            fieldName
          })
        ).unwrap();

        toast.success(`${fieldName} verified successfully`);
      } catch (error) {
        if (error.includes('already verified')) {
          setLocalVerifiedState(prev => ({
            ...prev,
            [fieldName]: true
          }));
          toast.success(`${fieldName} is already verified`);
        } else {
          setLocalVerifiedState(prev => ({
            ...prev,
            [fieldName]: false
          }));
          toast.error(error || `Failed to verify ${fieldName}`);
        }
      }
    }
  };

  const getVerifiedStatus = (fieldName, propVerified) => {
    if (localVerifiedState.hasOwnProperty(fieldName)) {
      return localVerifiedState[fieldName];
    }
    if (propVerified !== undefined) {
      return propVerified;
    }
    return false;
  };

  const renderField = (label, fieldName, value, isVerified, icon) => {
    const Icon = icon;
    const verified = getVerifiedStatus(fieldName,
      typeof value === 'object' ? value.verified : isVerified
    );
    const fieldValue = typeof value === 'object' ? value.value : value;

    return (
      <div className="space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{label}:</span>
          </div>
          <div className="flex items-center space-x-2">
            {verified ? (
              <Badge variant="success" className="bg-green-50 text-green-700 border-green-100">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-100">
                <Clock className="h-3 w-3 mr-1" />
                Pending
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between pl-6">
          <span className="text-sm text-gray-600">{fieldValue}</span>
          <div className="flex items-center">
            <Checkbox
              id={`verify-${fieldName}-${doctor._id}`}
              checked={verified}
              onCheckedChange={() => handleVerifyField(fieldName, verified)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={verified || verifyingField}
            />
            <label htmlFor={`verify-${fieldName}-${doctor._id}`} className="sr-only">
              Verify {fieldName}
            </label>
          </div>
        </div>
      </div>
    );
  };

  const renderDocumentField = (label, fieldName, value, isVerified, docUrl) => {
    const verified = getVerifiedStatus(fieldName, isVerified);
    const fieldValue = value?.value || value;

    return (
      <div className="space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{label}:</span>
          </div>
          <div className="flex items-center space-x-2">
            {verified ? (
              <Badge variant="success" className="bg-green-50 text-green-700 border-green-100">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-100">
                <Clock className="h-3 w-3 mr-1" />
                Pending
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between pl-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{fieldValue}</span>
            {docUrl && (
              <a
                href={docUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-gray-500 hover:text-gray-700"
                aria-label={`View ${label} document`}
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <div className="flex items-center">
            <Checkbox
              id={`verify-doc-${fieldName}-${doctor._id}`}
              checked={verified}
              onCheckedChange={() => handleVerifyField(fieldName, verified)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={verified || verifyingField}
            />
            <label htmlFor={`verify-doc-${fieldName}-${doctor._id}`} className="sr-only">
              Verify {label}
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="h-fit hover:shadow-lg transition-shadow duration-200 border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={doctor.profilePhotoUrl} alt={doctor.name} />
            <AvatarFallback className="bg-blue-50 text-blue-600">
              {doctor.name?.charAt(0) || 'D'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold text-gray-800">
              {doctor.title} {doctor.name}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <Badge
                variant={doctor.isVerified ? "success" : "secondary"}
                className={doctor.isVerified
                  ? "bg-green-50 text-green-700 border-green-100"
                  : "bg-orange-50 text-orange-700 border-orange-100"
                }
              >
                {doctor.isVerified ? 'Verified' : 'Pending Verification'}
              </Badge>
              <Badge
                variant={doctor.isActive ? "default" : "secondary"}
                className={doctor.isActive
                  ? "bg-blue-50 text-blue-700 border-blue-100"
                  : "bg-gray-50 text-gray-700 border-gray-100"
                }
              >
                {doctor.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-1">
        {renderField('Gender', 'gender', doctor.gender, doctor.gender?.verified, Users)}
        {renderField('City', 'city', doctor.city, doctor.city?.verified, MapPin)}
        {renderField('Experience', 'experience', `${doctor.experience} years`, doctor.experience?.verified, Stethoscope)}
        {renderField('Specialization', 'specialization', doctor.specialization, doctor.specialization?.verified, Stethoscope)}

        <Separator className="my-2 bg-gray-100" />

        {renderDocumentField(
          'Qualification',
          'qualification',
          doctor.qualification,
          doctor.qualification?.verified,
          doctor.qualificationDocsUrl
        )}

        {renderDocumentField(
          'Registration',
          'registration',
          doctor.registration,
          doctor.registration?.verified,
          doctor.registrationProofUrl
        )}

        {renderDocumentField(
          'Identity Proof',
          'identityProof',
          doctor.identityProof,
          doctor.identityProof?.verified,
          doctor.identityProofUrl
        )}

        <Separator className="my-2 bg-gray-100" />

        <div className="text-xs text-gray-500 space-y-1 p-3">
          <div className="flex justify-between">
            <span>Created:</span>
            <span className="text-gray-700">{new Date(doctor.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Updated:</span>
            <span className="text-gray-700">{new Date(doctor.updatedAt).toLocaleDateString()}</span>
          </div>
          {doctor.lastLogin && (
            <div className="flex justify-between">
              <span>Last Login:</span>
              <span className="text-gray-700">{new Date(doctor.lastLogin).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;


// 'use client';

// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { verifyDoctorFieldAPI } from '../../store/slices/doctorSlice';
// import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
// import { Checkbox } from '../../../components/ui/checkbox';
// import { Badge } from '../../../components/ui/badge';
// import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
// import { Separator } from '../../../components/ui/separator';
// import { MapPin, Stethoscope, GraduationCap, FileText, Users, CheckCircle, Clock, ExternalLink } from 'lucide-react';
// import { toast } from 'sonner';

// const DoctorCard = ({ doctor }) => {
//   const [localVerifiedState, setLocalVerifiedState] = useState({});
//   const dispatch = useDispatch();
//   const { verifyingField } = useSelector(state => state.doctors);

//   const handleVerifyField = async (fieldName, isCurrentlyVerified) => {
//     if (!isCurrentlyVerified) {
//       try {
//         setLocalVerifiedState(prev => ({
//           ...prev,
//           [fieldName]: true
//         }));

//         await dispatch(
//           verifyDoctorFieldAPI({
//             doctorId: doctor._id,
//             fieldName
//           })
//         ).unwrap();

//         toast.success(`${fieldName} verified successfully`);
//       } catch (error) {
//         if (error.includes('already verified')) {
//           setLocalVerifiedState(prev => ({
//             ...prev,
//             [fieldName]: true
//           }));
//           toast.success(`${fieldName} is already verified`);
//         } else {
//           setLocalVerifiedState(prev => ({
//             ...prev,
//             [fieldName]: false
//           }));
//           toast.error(error || `Failed to verify ${fieldName}`);
//         }
//       }
//     }
//   };

//   const getVerifiedStatus = (fieldName, propVerified) => {
//     if (localVerifiedState.hasOwnProperty(fieldName)) {
//       return localVerifiedState[fieldName];
//     }
//     if (propVerified !== undefined) {
//       return propVerified;
//     }
//     return false;
//   };

//   const renderDocumentSection = (label, fieldName, docUrlFieldName) => {
//     const field = doctor[fieldName];
//     const docUrl = doctor[docUrlFieldName]?.value || doctor[docUrlFieldName];
//     const fieldVerified = getVerifiedStatus(fieldName, field?.verified);
//     const docVerified = getVerifiedStatus(docUrlFieldName, doctor[docUrlFieldName]?.verified);

//     return (
//       <div className="space-y-3 p-4 rounded-lg border border-gray-200 bg-white">
//         <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
        
//         {/* Document Field */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <span className="text-gray-600">{field?.value || field}</span>
//             <Badge variant={fieldVerified ? "success" : "secondary"} className="px-2 py-0.5">
//               {fieldVerified ? 'Verified' : 'Pending'}
//             </Badge>
//           </div>
//           <Checkbox
//             checked={fieldVerified}
//             onCheckedChange={() => handleVerifyField(fieldName, fieldVerified)}
//             className="h-5 w-5 rounded border-gray-300 data-[state=checked]:bg-blue-600"
//             disabled={fieldVerified || verifyingField}
//           />
//         </div>

//         {/* Document URL Section */}
//         <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
//           <a
//             href={docUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center text-blue-600 hover:underline"
//           >
//             <ExternalLink className="h-4 w-4 mr-2" />
//             View Document
//           </a>
//           <div className="flex items-center space-x-3">
//             <Badge variant={docVerified ? "success" : "secondary"} className="px-2 py-0.5">
//               {docVerified ? 'Verified' : 'Pending'}
//             </Badge>
//             <Checkbox
//               checked={docVerified}
//               onCheckedChange={() => handleVerifyField(docUrlFieldName, docVerified)}
//               className="h-5 w-5 rounded border-gray-300 data-[state=checked]:bg-blue-600"
//               disabled={docVerified || verifyingField}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderBasicField = (label, fieldName, value, icon) => {
//     const Icon = icon;
//     const verified = getVerifiedStatus(fieldName, value?.verified);
//     const fieldValue = value?.value || value;

//     return (
//       <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
//         <div className="flex items-center space-x-3">
//           <Icon className="h-5 w-5 text-gray-500" />
//           <span className="text-gray-700">{label}</span>
//           <span className="text-gray-600">{fieldValue}</span>
//         </div>
//         <div className="flex items-center space-x-3">
//           <Badge variant={verified ? "success" : "secondary"} className="px-2 py-0.5">
//             {verified ? 'Verified' : 'Pending'}
//           </Badge>
//           <Checkbox
//             checked={verified}
//             onCheckedChange={() => handleVerifyField(fieldName, verified)}
//             className="h-5 w-5 rounded border-gray-300 data-[state=checked]:bg-blue-600"
//             disabled={verified || verifyingField}
//           />
//         </div>
//       </div>
//     );
//   };

//   return (
//     <Card className="h-fit hover:shadow-lg transition-shadow duration-200 border-gray-200">
//       <CardHeader className="pb-4">
//         <div className="flex items-center space-x-4">
//           <Avatar>
//             <AvatarImage src={doctor.profilePhotoUrl?.value || doctor.profilePhotoUrl} alt={doctor.name?.value || doctor.name} />
//             <AvatarFallback className="bg-blue-50 text-blue-600">
//               {(doctor.name?.value || doctor.name)?.charAt(0) || 'D'}
//             </AvatarFallback>
//           </Avatar>
//           <div className="flex-1">
//             <CardTitle className="text-xl font-semibold text-gray-800">
//               {doctor.title?.value || doctor.title} {doctor.name?.value || doctor.name}
//             </CardTitle>
//             <div className="flex items-center space-x-2 mt-2">
//               <Badge variant={doctor.isVerified ? "success" : "secondary"}>
//                 {doctor.isVerified ? 'Verified' : 'Pending Verification'}
//               </Badge>
//               <Badge variant={doctor.isActive ? "default" : "secondary"}>
//                 {doctor.isActive ? 'Active' : 'Inactive'}
//               </Badge>
//             </div>
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent className="space-y-4">
//         <div className="space-y-2">
//           {renderBasicField('Gender', 'gender', doctor.gender, Users)}
//           {renderBasicField('City', 'city', doctor.city, MapPin)}
//           {renderBasicField('Experience', 'experience', `${doctor.experience?.value || doctor.experience} years`, Stethoscope)}
//           {renderBasicField('Specialization', 'specialization', doctor.specialization, Stethoscope)}
//         </div>

//         <Separator className="my-2 bg-gray-200" />

//         <div className="space-y-4">
//           {renderDocumentSection('Qualification', 'qualification', 'qualificationDocsUrl')}
//           {renderDocumentSection('Registration', 'registration', 'registrationProofUrl')}
//           {renderDocumentSection('Identity Proof', 'identityProof', 'identityProofUrl')}
//         </div>

//         <Separator className="my-2 bg-gray-200" />

//         <div className="text-xs text-gray-500 space-y-1">
//           <div className="flex justify-between">
//             <span>Created:</span>
//             <span className="text-gray-700">{new Date(doctor.createdAt).toLocaleDateString()}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Updated:</span>
//             <span className="text-gray-700">{new Date(doctor.updatedAt).toLocaleDateString()}</span>
//           </div>
//           {doctor.lastLogin && (
//             <div className="flex justify-between">
//               <span>Last Login:</span>
//               <span className="text-gray-700">{new Date(doctor.lastLogin).toLocaleDateString()}</span>
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default DoctorCard;