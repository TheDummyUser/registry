import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export type FormData = {
  username: string;
  password: string;
};

export interface ContainerProps {
  children: ReactNode;
  ph?: number;
  center?: boolean;
  style?: ViewStyle;
}
