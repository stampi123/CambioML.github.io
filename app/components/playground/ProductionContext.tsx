import React, { createContext, useContext, useState } from 'react';

interface ProductionContextType {
  isProduction: boolean;
  auth0Enabled: boolean;
  apiURL: string;
  setIsProduction: React.Dispatch<React.SetStateAction<boolean>>;
  setAuth0Enabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductionContext = createContext<ProductionContextType | undefined>(undefined);

export const useProductionContext = () => {
  const context = useContext(ProductionContext);
  if (!context) {
    throw new Error('useProductionContext must be used within a ProductionProvider');
  }
  return context;
};

interface ProductionProviderProps {
  initialValue: boolean;
  initialAuth0Enabled: boolean;
  children: React.ReactNode;
}

export const ProductionProvider: React.FC<ProductionProviderProps> = ({
  children,
  initialValue,
  initialAuth0Enabled,
}) => {
  const [isProduction, setIsProduction] = useState(initialValue);
  const [auth0Enabled, setAuth0Enabled] = useState(initialAuth0Enabled);
  const apiURL = isProduction
    ? process.env.NEXT_PUBLIC_PLAYGROUND_API_URL || ''
    : process.env.NEXT_PUBLIC_PRE_PROD_PLAYGROUND_API_URL || '';

  return (
    <ProductionContext.Provider value={{ isProduction, apiURL, setIsProduction, auth0Enabled, setAuth0Enabled }}>
      {children}
    </ProductionContext.Provider>
  );
};
