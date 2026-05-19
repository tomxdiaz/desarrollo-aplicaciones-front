import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { COLORS } from '../../constants/colors';
import React, { useEffect, useState } from 'react';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';
import { useAuth } from '../../providers/auth.provider';

export default function AuthScreen({
  title,
  buttonText,
  handleAuth,
  alternativeActionText,
  alternativeActionLinkText,
  onPressLink,
}: {
  title: string;
  buttonText: string;
  handleAuth: (email: string, password: string) => Promise<void>;
  alternativeActionText: string;
  alternativeActionLinkText: string;
  onPressLink: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { appUser } = useAuth();

  useEffect(() => {
    if (appUser) {
      router.replace('/');
    }
  }, [appUser]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('../../../assets/logos/logo_outlined.png')} />
        <Text style={styles.logoTitle}>Provecho!</Text>
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder='example@email.com' value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder='**********' value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={() => handleAuth(email, password)}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>{alternativeActionText}</Text>
        <TouchableOpacity style={styles.registerButton} onPress={onPressLink}>
          <Text style={styles.registerButtonText}>{alternativeActionLinkText}</Text>
        </TouchableOpacity>
      </View>

      {/* <TouchableOpacity style={styles.guestButton} onPress={() => router.navigate('/')}>
        <Text style={styles.guestButtonText}>Continuar como invitado</Text>
      </TouchableOpacity> */}

      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${COLORS.primary.terracota}22`,
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.extra_large,
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: COLORS.primary.terracota,
    borderRadius: BORDER_RADIUS.extra_large,
    padding: SPACING.large,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    borderRadius: BORDER_RADIUS.large,
  },
  logoTitle: {
    fontSize: FONT_SIZES.title_large,
    fontWeight: 'bold',
    color: COLORS.common.blanco,
  },
  title: {
    fontSize: FONT_SIZES.title_base,
    fontWeight: 'bold',
    color: COLORS.primary.terracota,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.large,
    width: '80%',
    backgroundColor: COLORS.common.blanco,
    padding: SPACING.large,
    borderRadius: BORDER_RADIUS.medium,
  },
  input: {
    backgroundColor: `${COLORS.primary.terracota}22`,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    fontSize: FONT_SIZES.text_base,
  },
  button: {
    backgroundColor: COLORS.primary.terracota,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
  },
  buttonText: {
    color: COLORS.common.blanco,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
  },
  registerText: {
    color: COLORS.primary.caramelo,
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.small,
  },
  registerButtonText: {
    color: COLORS.primary.caramelo,
    fontWeight: 'bold',
  },
  guestButton: {
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.small,
  },
  guestButtonText: {
    color: COLORS.primary.caramelo,
    fontWeight: 'bold',
  },
});
