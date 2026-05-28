import { Redirect } from 'expo-router';
import { Button, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return <Redirect href='/restaurants' />;

  // return (
  //   <View style={styles.container}>
  //     {appUser && <Text>Bienvenido, {appUser.email}!</Text>}
  //     {appUser && <Text>Tu ID es: {appUser.id}!</Text>}
  //     {appUser && <Text>Tenes el rol: {appUser.global_role}!</Text>}

  //     {appUser && <Button title='Cerrar sesión' onPress={signOut} />}

  //     <Button title='Ir a Login' onPress={() => router.navigate('/signin')} />
  //     <Button title='Ir a Register' onPress={() => router.navigate('/register')} />

  //     <Text>Provecho!</Text>

  //     <StatusBar style='auto' />
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
