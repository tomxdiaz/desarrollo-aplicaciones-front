import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Restaurant } from '../../../types/types';
import { restaurantService } from '../../../services/restaurant.service';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';

const RestaurantEditScreen = ({
  restaurantId,
  restaurant,
  onRefresh,
}: {
  restaurantId: string;
  restaurant: Restaurant;
  onRefresh: () => Promise<void>;
}) => {
  const [name, setName] = useState(restaurant.name);
  const [description, setDescription] = useState(restaurant.description ?? '');
  const [address, setAddress] = useState(restaurant.address ?? '');
  const [submitting, setSubmitting] = useState(false);

  // Sync form when parent refreshes restaurant data after a successful save.
  useEffect(() => {
    setName(restaurant.name);
    setDescription(restaurant.description ?? '');
    setAddress(restaurant.address ?? '');
  }, [restaurant]);

  const handleSave = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert('Falta el nombre', 'El nombre del restaurante es requerido.');
      return;
    }

    setSubmitting(true);

    try {
      await restaurantService.updateRestaurant(restaurantId, {
        name: trimmedName,
        description: description.trim() || null,
        address: address.trim() || null,
      });
      await onRefresh();
      Alert.alert('Guardado', 'La información del restaurante fue actualizada.');
    } catch (error) {
      console.error('Error updating restaurant:', error);
      Alert.alert('Error', 'No se pudo actualizar el restaurante. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.field}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder='Nombre del restaurante'
            placeholderTextColor={COLORS.common.gris_medio}
            value={name}
            onChangeText={setName}
            editable={!submitting}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder='Descripción del restaurante'
            placeholderTextColor={COLORS.common.gris_medio}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical='top'
            editable={!submitting}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Ubicación</Text>
          <TextInput
            style={styles.input}
            placeholder='Barrio, Ciudad'
            placeholderTextColor={COLORS.common.gris_medio}
            value={address}
            onChangeText={setAddress}
            editable={!submitting}
          />
        </View>

        <Pressable
          style={[styles.saveButton, submitting && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={submitting}
          accessibilityRole='button'
          accessibilityLabel='Guardar cambios'
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.common.blanco} />
          ) : (
            <Text style={styles.saveButtonText}>Guardar cambios</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    gap: SPACING.medium,
    padding: SPACING.large,
    paddingBottom: SPACING.extra_large,
  },
  field: {
    gap: SPACING.small,
  },
  label: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.common.gris_oscuro,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.surface.borde_calido,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.common.blanco,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.medium,
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.negro_principal,
  },
  textArea: {
    minHeight: 100,
    paddingTop: SPACING.medium,
  },
  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.primary.terracota,
    marginTop: SPACING.small,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
  },
});

export default RestaurantEditScreen;
