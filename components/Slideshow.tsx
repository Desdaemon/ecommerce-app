import { Image, ImageProps } from '@mantine/core';
import ImageGallery, { ReactImageGalleryProps } from 'react-image-gallery';

export default function Slideshow(props: ReactImageGalleryProps & ImageProps) {
  if (props.items.length === 1) return <Image {...props} />;
  return <ImageGallery autoPlay {...props} />;
}
