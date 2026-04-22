import { createContext, useContext, useReducer } from 'react';

const initialState = {
  mode: 'customer',
  loaderDone: false,
  bookingFormData: null,
  bookingSystemOpen: false,
  selectedCar: null,
  lenis: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'LOADER_DONE':
      return { ...state, loaderDone: true };
    case 'OPEN_BOOKING':
      return { ...state, bookingFormData: action.payload, bookingSystemOpen: true, selectedCar: null };
    case 'SELECT_CAR':
      return { ...state, selectedCar: action.payload };
    case 'CLOSE_BOOKING':
      return { ...state, bookingSystemOpen: false, bookingFormData: null, selectedCar: null };
    case 'SET_LENIS':
      return { ...state, lenis: action.payload };
    default:
      return state;
  }
}

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return ctx;
}
