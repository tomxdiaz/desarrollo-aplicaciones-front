import * as SplashScreen from 'expo-splash-screen';
import { Image, StyleSheet, View, Text } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';

SplashScreen.setOptions({
  duration: 3000,
  fade: true,
});

export default function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.logoTitleContainer}>
        <Image style={styles.logo} source={require('../../../assets/logos/logo_outlined.png')} />
        <View>
          <Text style={styles.title}>Provecho!</Text>
          <Text style={styles.slogan}>Hola soy el eslogan</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary.terracota,
    padding: SPACING.medium,
  },
  logoTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.medium,
  },
  logo: {
    width: 80,
    height: 60,
    resizeMode: 'contain',
  },
  title: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.title_base,
    fontWeight: 'bold',
  },
  slogan: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.text_base,
  },
});
