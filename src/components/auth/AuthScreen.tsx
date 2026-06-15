import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import React, { useEffect, useState } from 'react';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';
import { useAuth } from '../../providers/auth.provider';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface AuthScreenProps {
  readonly title: string;
  readonly buttonText: string;
  readonly handleAuth: (email: string, password: string) => Promise<void>;
  readonly alternativeActionText: string;
  readonly alternativeActionLinkText: string;
  readonly onPressLink: () => void;
}

export default function AuthScreen({
  title,
  buttonText,
  handleAuth,
  alternativeActionText,
  alternativeActionLinkText,
  onPressLink,
}: AuthScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { appUser, loading } = useAuth();

  useEffect(() => {
    if (appUser && !loading) {
      router.replace('/');
    }
  }, [appUser, loading]);

  const handlePress = async () => {
    if (isLoading) return;
    setError(null);
    setIsLoading(true);
    try {
      await handleAuth(email, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ocurrió un error';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps='handled'
      enableOnAndroid
      showsVerticalScrollIndicator={false}>
      
      <View style={styles.inner}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('../../../assets/logos/logo_outlined.png')} />
          <Text style={styles.logoTitle}>Provecho!</Text>
        </View>

        <Text style={styles.title}>{title}</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder='example@email.com'
            placeholderTextColor='#888888'
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize='none'
          />

          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder='**********'
            placeholderTextColor='#888888'
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handlePress}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={COLORS.common.blanco} />
            ) : (
              <Text style={styles.buttonText}>{buttonText}</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.alternativeActionContainer}>
          <Text style={styles.alternativeActionText}>{alternativeActionText}</Text>

          <TouchableOpacity style={styles.alternativeActionButton} onPress={onPressLink}>
            <Text style={styles.alternativeActionButtonText}>{alternativeActionLinkText}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <StatusBar style='auto' />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: `${COLORS.primary.terracota}22`,
  },

  content: {
    flexGrow: 1,
    padding: SPACING.large,
  },

  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.extra_large,
  },

  logoContainer: {
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
    width: '80%',
    backgroundColor: COLORS.common.blanco,
    padding: SPACING.large,
    borderRadius: BORDER_RADIUS.medium,
    gap: SPACING.large,
  },

  input: {
    backgroundColor: `${COLORS.primary.terracota}22`,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    fontSize: FONT_SIZES.text_base,
  },

  passwordInput: {
    color: COLORS.common.gris_medio,
  },

  errorText: {
    color: COLORS.status.error,
    fontSize: FONT_SIZES.text_small,
    textAlign: 'center',
  },

  button: {
    backgroundColor: COLORS.primary.terracota,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    minHeight: 44,
    justifyContent: 'center',
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: COLORS.common.blanco,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  alternativeActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
  },

  alternativeActionText: {
    color: COLORS.primary.caramelo,
  },

  alternativeActionButton: {
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.small,
  },

  alternativeActionButtonText: {
    color: COLORS.primary.caramelo,
    fontWeight: 'bold',
  },
});