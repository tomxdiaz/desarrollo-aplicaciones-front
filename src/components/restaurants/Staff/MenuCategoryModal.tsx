import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { ICON_SIZES } from '../../../constants/icon_sizes';

const MenuCategoryModal = ({
  visible,
  existingNames,
  onClose,
  onCreate,
}: {
  visible: boolean;
  existingNames: string[];
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}) => {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) {
      setName('');
      setSubmitting(false);
    }
  }, [visible]);

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert('Falta el nombre', 'Ingresá un nombre para la categoría.');
      return;
    }

    setSubmitting(true);

    try {
      await onCreate(trimmedName);
      onClose();
    } catch (error) {
      console.error('Error creating category:', error);
      Alert.alert('Error', 'No se pudo crear la categoría. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.sheetWrapper} onPress={() => {}}>
          <KeyboardAwareScrollView
            contentContainerStyle={styles.sheet}
            keyboardShouldPersistTaps='handled'
            enableOnAndroid
            extraScrollHeight={80}
            showsVerticalScrollIndicator={false}>
            <View style={styles.iconWrap}>
              <Ionicons name='folder-outline' size={ICON_SIZES.large} color={COLORS.primary.terracota} />
            </View>

            <Text style={styles.title}>Nueva categoría</Text>
            <Text style={styles.subtitle}>Las categorías organizan el menú por secciones.</Text>

            <TextInput
              style={styles.input}
              placeholder='Ej: Entradas, Especialidades, Bebidas'
              placeholderTextColor={COLORS.common.gris_medio}
              value={name}
              onChangeText={setName}
              editable={!submitting}
            />

            {existingNames.length > 0 ? (
              <View style={styles.tagsBlock}>
                <Text style={styles.tagsTitle}>Categorías actuales</Text>
                <KeyboardAwareScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsRow}>
                  {existingNames.map((item) => (
                    <View key={item} style={styles.tag}>
                      <Text style={styles.tagText}>{item}</Text>
                    </View>
                  ))}
                </KeyboardAwareScrollView>
              </View>
            ) : null}

            <View style={styles.actionsRow}>
              <Pressable style={styles.cancelButton} onPress={handleClose} disabled={submitting}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.createButton} onPress={handleSubmit} disabled={submitting}>
                {submitting ? <ActivityIndicator color={COLORS.common.blanco} /> : <Text style={styles.createButtonText}>Crear</Text>}
              </Pressable>
            </View>
          </KeyboardAwareScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.large,
  },
  sheetWrapper: {
    width: '100%',
    backgroundColor: COLORS.common.blanco,
    borderRadius: BORDER_RADIUS.large,
    overflow: 'hidden',
  },
  sheet: {
    padding: SPACING.large,
    gap: SPACING.medium,
  },
  iconWrap: {
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface.tarjeta_calida,
  },
  title: {
    textAlign: 'center',
    fontSize: FONT_SIZES.title_base,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  subtitle: {
    textAlign: 'center',
    color: COLORS.common.gris_oscuro,
    fontSize: FONT_SIZES.text_small,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.surface.borde_calido,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.surface.fondo_crema,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.medium,
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.negro_principal,
  },
  tagsBlock: {
    gap: SPACING.small,
  },
  tagsTitle: {
    color: COLORS.common.gris_oscuro,
    fontWeight: '700',
    fontSize: FONT_SIZES.text_small,
  },
  tagsRow: {
    gap: SPACING.small,
  },
  tag: {
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.surface.tarjeta_calida,
    borderWidth: 1,
    borderColor: COLORS.surface.borde_calido,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
  },
  tagText: {
    color: COLORS.primary.caramelo,
    fontSize: FONT_SIZES.text_small,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.small,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.surface.fondo_crema,
  },
  cancelButtonText: {
    color: COLORS.common.gris_oscuro,
    fontWeight: '700',
    fontSize: FONT_SIZES.text_base,
  },
  createButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.primary.terracota,
  },
  createButtonText: {
    color: COLORS.common.blanco,
    fontWeight: '700',
    fontSize: FONT_SIZES.text_base,
  },
});

export default MenuCategoryModal;
