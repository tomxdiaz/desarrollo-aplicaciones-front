import { StyleSheet, View, Text, TextInput } from 'react-native';
import { AppUser } from '../../types/types';
import { COLORS } from '../../constants/colors';
import { FONT_SIZES } from '../../constants/font_sizes';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing_and_borders';
import { useState } from 'react';
import UserCard from './UserCard';
import { useAuth } from '../../providers/auth.provider';

type AllUsersListProps = {
  users: AppUser[];
  onUserUpdated?: (user: AppUser) => void;
};

const AllUsersList = ({ users, onUserUpdated }: AllUsersListProps) => {
  const { appUser } = useAuth();
  const [searchText, setSearchText] = useState('');

  const otherUsers = users.filter((user) => user.id !== appUser?.id);
  const filteredUsers = otherUsers.filter((user) => user.email.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuarios</Text>

      <TextInput style={styles.input} placeholder='Buscar usuarios...' value={searchText} onChangeText={setSearchText} />

      <View style={styles.list}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => <UserCard key={user.id} user={user} onUserUpdated={onUserUpdated} />)
        ) : (
          <Text style={styles.unavailableText}>{'No se obtuvieron resultados :('}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: SPACING.large,
    gap: SPACING.large,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.medium,
    fontSize: FONT_SIZES.text_large,
  },
  title: {
    fontSize: FONT_SIZES.title_base,
    fontWeight: '800',
    color: COLORS.primary.terracota,
  },
  list: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: SPACING.medium,
  },
  unavailableText: {
    fontSize: FONT_SIZES.text_large,
    color: COLORS.common.gris_oscuro,
  },
});

export default AllUsersList;
