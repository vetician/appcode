'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyDoctorFieldAPI } from '../../store/slices/doctorSlice';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Checkbox } from '../../../components/ui/checkbox';
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Separator } from '../../../components/ui/separator';
import { MapPin, Stethoscope, GraduationCap, FileText, Users, CheckCircle, Clock, ExternalLink, Image as ImageIcon, User, BookOpen, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

const DoctorCard = ({ doctor, onBack }) => {
  const [localVerifiedState, setLocalVerifiedState] = useState({});
  const dispatch = useDispatch();
  const { verifyingField } = useSelector(state => state.doctors);

  // Helper function to get field value (handles both direct and nested fields)
  const getFieldValue = (field) => {
    return field?.value || field;
  };

  // Helper function to get initials for avatar
  const getInitials = (name) => {
    const nameStr = typeof name === 'string' ? name : name?.value || '';
    return nameStr.charAt(0) || 'D';
  };

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
    return propVerified;
  };

  const renderField = (label, fieldName, fieldData, icon) => {
    const Icon = icon;
    const verified = getVerifiedStatus(fieldName, fieldData?.verified);
    const fieldValue = getFieldValue(fieldData);

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

  const renderDocumentField = (label, fieldName, fieldData, docUrlField) => {
    const verified = getVerifiedStatus(fieldName, fieldData?.verified);
    const fieldValue = getFieldValue(fieldData);
    const docUrl = getFieldValue(docUrlField);
    const docVerified = getVerifiedStatus(`${fieldName}Url`, docUrlField?.verified);

    return (
      <div className="space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{label}:</span>
          </div>
        </div>

        {/* Document Info */}
        <div className="pl-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{fieldValue}</span>
            <div className="flex items-center space-x-2">
              {verified ? (
                <Badge variant="success" className="bg-green-50 text-green-700 border-green-100 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Info Verified
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-100 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Info Pending
                </Badge>
              )}
              <Checkbox
                id={`verify-info-${fieldName}-${doctor._id}`}
                checked={verified}
                onCheckedChange={() => handleVerifyField(fieldName, verified)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={verified || verifyingField}
              />
            </div>
          </div>

          {/* Document URL */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Document</span>
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
            <div className="flex items-center space-x-2">
              {docVerified ? (
                <Badge variant="success" className="bg-green-50 text-green-700 border-green-100 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Doc Verified
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-100 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Doc Pending
                </Badge>
              )}
              <Checkbox
                id={`verify-doc-${fieldName}-${doctor._id}`}
                checked={docVerified}
                onCheckedChange={() => handleVerifyField(`${fieldName}Url`, docVerified)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={docVerified || verifyingField}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProfilePhotoField = () => {
    const verified = getVerifiedStatus('profilePhotoUrl', doctor.profilePhotoUrl?.verified);
    const photoUrl = getFieldValue(doctor.profilePhotoUrl);

    return (
      <div className="space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ImageIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Profile Photo:</span>
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
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={photoUrl} alt={getFieldValue(doctor.name)} />
              <AvatarFallback className="bg-blue-50 text-blue-600">
                {getInitials(doctor.name)}
              </AvatarFallback>
            </Avatar>
            {photoUrl && (
              <a
                href={photoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-gray-500 hover:text-gray-700"
                aria-label="View profile photo"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <div className="flex items-center">
            <Checkbox
              id={`verify-profilePhotoUrl-${doctor._id}`}
              checked={verified}
              onCheckedChange={() => handleVerifyField('profilePhotoUrl', verified)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={verified || verifyingField}
            />
            <label htmlFor={`verify-profilePhotoUrl-${doctor._id}`} className="sr-only">
              Verify Profile Photo
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="h-fit hover:shadow-lg transition-shadow duration-200 border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 px-0 hover:bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to list
          </Button>
          <Avatar>
            <AvatarImage src={getFieldValue(doctor.profilePhotoUrl)} alt={getFieldValue(doctor.name)} />
            <AvatarFallback className="bg-blue-50 text-blue-600">
              {getInitials(doctor.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold text-gray-800">
              {getFieldValue(doctor.title)} {getFieldValue(doctor.name)}
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
        {renderProfilePhotoField()}
        {renderField('Title', 'title', doctor.title, BookOpen)}
        {renderField('Name', 'name', doctor.name, User)}
        {renderField('Gender', 'gender', doctor.gender, Users)}
        {renderField('City', 'city', doctor.city, MapPin)}
        {renderField('Experience', 'experience', doctor.experience, Stethoscope)}
        {renderField('Specialization', 'specialization', doctor.specialization, Stethoscope)}

        <Separator className="my-2 bg-gray-100" />

        {renderDocumentField(
          'Qualification',
          'qualification',
          doctor.qualification,
          doctor.qualificationUrl
        )}
        {renderDocumentField(
          'Registration',
          'registration',
          doctor.registration,
          doctor.registrationUrl
        )}

        {renderDocumentField(
          'Identity Proof',
          'identityProof',
          doctor.identityProof,
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