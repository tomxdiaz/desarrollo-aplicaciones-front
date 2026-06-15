import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONT_SIZES } from '../../constants/font_sizes';
import { SPACING } from '../../constants/spacing_and_borders';

type FormFieldProps = {
  label: string;
  children: React.ReactNode;
};

const FormField = ({ label, children }: FormFieldProps) => {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
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
});

export default FormField;
