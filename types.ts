export interface Slot {
  id: string;
  isBooked: boolean;
  bookedBy?: string;
  bookedEmail?: string;
  bookedPhone?: string;
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

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
}