import { View, Text } from 'react-native';
import { AppUser } from '../../types/types';

const AllUsersList = ({ users }: { users: AppUser[] }) => {
  return (
    <View>
      <Text>Cantidad de usuarios: {users.length}</Text>
    </View>
  );
};

export default AllUsersList;
