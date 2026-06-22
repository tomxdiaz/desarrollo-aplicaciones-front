import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONT_SIZES } from '../../constants/font_sizes';
import { SPACING } from '../../constants/spacing_and_borders';

type FormFieldProps = {
  label: string;
  children: React.ReactNode;
  maxLength?: number;
  value?: string;
};

const FormField = ({ label, children, maxLength, value }: FormFieldProps) => {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {maxLength !== undefined && (
        <Text style={styles.counter}>{(value ?? '').length}/{maxLength}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    gap: SPACING.small,
  },
  label: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.common.gris_oscuro,
  },
  counter: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_medio,
    textAlign: 'right',
  },
});

export default FormField;
