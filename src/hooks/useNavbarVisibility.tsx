import React, { useState, useContext, createContext, ReactNode } from 'react';

interface NavbarVisibilityContextType {
  isNavbarVisible: boolean;
  hideNavbar: () => void;
  showNavbar: () => void;
}

const NavbarVisibilityContext = createContext<NavbarVisibilityContextType | undefined>(undefined);

export const useNavbarVisibility = () => {
  const context = useContext(NavbarVisibilityContext);
  if (context === undefined) {
    throw new Error('useNavbarVisibility must be used within a NavbarVisibilityProvider');
  }
  return context;
};

interface NavbarVisibilityProviderProps {
  children: ReactNode;
}

export const NavbarVisibilityProvider: React.FC<NavbarVisibilityProviderProps> = ({ children }) => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const hideNavbar = () => setIsNavbarVisible(false);
  const showNavbar = () => setIsNavbarVisible(true);

  return (
    <NavbarVisibilityContext.Provider value={{ isNavbarVisible, hideNavbar, showNavbar }}>
      {children}
    </NavbarVisibilityContext.Provider>
  );
};