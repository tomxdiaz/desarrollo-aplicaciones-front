import * as ImagePicker from 'expo-image-picker';
import { ImageFile } from '../types/types';

/**
 * Derives a sensible filename + mime type from a picked asset and returns the
 * shape expected as a multipart file part.
 */
const toImageFile = (asset: ImagePicker.ImagePickerAsset): ImageFile => {
  const fallbackName = asset.uri.split('/').pop() || `image-${Date.now()}.jpg`;
  const name = asset.fileName || fallbackName;

  const extension = name.includes('.') ? name.split('.').pop()!.toLowerCase() : 'jpg';
  const type = asset.mimeType || `image/${extension === 'jpg' ? 'jpeg' : extension}`;

  return { uri: asset.uri, name, type };
};

/**
 * Opens the device library so the user can pick a single image.
 * Returns the selected image (ready to upload) or null if cancelled / denied.
 */
export const pickImage = async (): Promise<ImageFile | null> => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.8,
  });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  return toImageFile(result.assets[0]);
};

/**
 * Appends image fields to a FormData body following the backend contract:
 * an `image` file part for a newly picked image, or an `existingImage` URL to
 * keep the current one. Sends neither when there is no change.
 */
export const appendImageToFormData = (
  form: FormData,
  imageFile?: ImageFile | null,
  existingImage?: string | null,
): void => {
  if (imageFile) {
    // React Native FormData accepts a { uri, name, type } file descriptor.
    form.append('image', imageFile as unknown as Blob);
  } else if (existingImage !== undefined && existingImage !== null) {
    form.append('existingImage', existingImage);
  }
};
