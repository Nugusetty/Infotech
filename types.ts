export interface RegistrationFormData {
  companyName: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  panNumber: string;
  dob: string;
  uanNumber: string;
  permanentAddress: string;
  offerDate: string;
  joiningDate: string;
  joiningCTC: string;
  joiningDesignation: string;
  hikeDate: string;
  currentCTC: string;
  currentDesignation: string;
  resignationDate: string;
  relivingDate: string;
  pfRequired: string;
  highestQualification: string;
  yearOfPass: string;
  technology: string;
  bankName: string;
  bankAccountNumber: string;
  bankBranch: string;
  bankIFSCCode: string;
  gender: string;
  marriageStatus: string;
}

export interface Slot {
  id: string;
  isBooked: boolean;
  bookedBy?: string;
  registrationDetails?: RegistrationFormData;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  website: string;
  established: string;
  description: string;
  slots: Slot[];
}