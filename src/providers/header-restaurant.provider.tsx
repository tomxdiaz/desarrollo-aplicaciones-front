import { createContext, useContext, useMemo, useState } from 'react';

type HeaderRestaurantContextType = {
  restaurantName: string | null;
  setRestaurantName: (name: string | null) => void;
};

type HeaderRestaurantProviderProps = Readonly<{
  children: React.ReactNode;
}>;

const HeaderRestaurantContext = createContext<HeaderRestaurantContextType | null>(null);

export function HeaderRestaurantProvider({ children }: HeaderRestaurantProviderProps) {
  const [restaurantName, setRestaurantName] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      restaurantName,
      setRestaurantName,
    }),
    [restaurantName],
  );

  return <HeaderRestaurantContext.Provider value={value}>{children}</HeaderRestaurantContext.Provider>;
}

export function useHeaderRestaurant() {
  const context = useContext(HeaderRestaurantContext);

  if (!context) {
    throw new Error('useHeaderRestaurant must be used within HeaderRestaurantProvider');
  }

  return context;
}
