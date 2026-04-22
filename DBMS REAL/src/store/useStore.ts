import { create } from 'zustand';

interface BookingParams {
  pickupLocation: string;
  returnLocation: string;
  pickupDate: string | null;
  returnDate: string | null;
  carClass: 'subcompact' | 'compact' | 'sedan' | 'luxury' | null;
}

interface AppState {
  isEmployeeMode: boolean;
  setEmployeeMode: (val: boolean) => void;
  bookingParams: BookingParams;
  setBookingParams: (params: Partial<BookingParams>) => void;
  activePromotion: 'luxury' | 'sedan' | 'compact' | 'subcompact' | null;
}

export const useStore = create<AppState>((set) => ({
  isEmployeeMode: false,
  setEmployeeMode: (val) => set({ isEmployeeMode: val }),
  bookingParams: {
    pickupLocation: '',
    returnLocation: '',
    pickupDate: null,
    returnDate: null,
    carClass: null,
  },
  setBookingParams: (params) => set((state) => ({ bookingParams: { ...state.bookingParams, ...params } })),
  // Mock weekly promotion
  activePromotion: 'luxury', 
}));
