import { StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../../providers/auth.provider';
import Header2 from './Header-2';

type Layout2Props = {
  readonly children: React.ReactNode;
};

export default function Layout2({ children }: Layout2Props) {
  const { appUser, loading } = useAuth();

  if (!appUser && !loading) {
    return <Redirect href='/signin' />;
  }

  return (
    <View style={styles.layout}>
      <Header2 />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
});
