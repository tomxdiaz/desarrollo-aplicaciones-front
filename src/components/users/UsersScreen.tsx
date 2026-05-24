import { useState, useEffect } from 'react';
import { AppUser } from '../../types/types';
import { appUserService } from '../../services/app_user.service';
import AllUsersList from './AllUsersList';

const MyRestaurantsListScreen = () => {
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await appUserService.getAllUsers();
        setAllUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        setAllUsers([]);
      }
    };

    fetchData();
  }, []);

  const handleUserUpdated = (updated: AppUser) => {
    setAllUsers((prev) => prev.map((user) => (user.id === updated.id ? updated : user)));
  };

  return <AllUsersList users={allUsers} onUserUpdated={handleUserUpdated} />;
};

export default MyRestaurantsListScreen;
