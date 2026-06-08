import { createContext, useContext, useMemo, useState } from 'react';

type HeaderRestaurantContextType = {
  restaurantName: string | null;
  setRestaurantName: (name: string | null) => void;
};

const HeaderRestaurantContext = createContext<HeaderRestaurantContextType | null>(null);

/**
 * Holds the restaurant name to display under the title in Header-1.
 * Detail screens (own restaurant admin / public restaurant detail) publish
 * their name while mounted; everywhere else it stays null so the header just
 * shows "Provecho!".
 */
export function HeaderRestaurantProvider({ children }: { children: React.ReactNode }) {
  const [restaurantName, setRestaurantName] = useState<string | null>(null);

  const value = useMemo(() => ({ restaurantName, setRestaurantName }), [restaurantName]);

  return <HeaderRestaurantContext.Provider value={value}>{children}</HeaderRestaurantContext.Provider>;
}

export function useHeaderRestaurant() {
  const context = useContext(HeaderRestaurantContext);
  if (!context) {
    throw new Error('useHeaderRestaurant must be used within HeaderRestaurantProvider');
  }
  return context;
}
