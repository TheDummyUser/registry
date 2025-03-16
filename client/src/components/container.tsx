import React, { ReactNode, useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '~/utils/colors';

interface ContainerProps {
  style?: ViewStyle;
  children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children, style }) => {
  const insets = useSafeAreaInsets();

  return <View style={[styles.container, style, { paddingTop: insets.top }]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 10,
  },
});

export default Container;
