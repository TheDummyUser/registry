import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

import { Theme } from '~/utils/colors';
interface ContainerProps {
  children: ReactNode;
  ph?: number;
  center?: boolean;
  style?: ViewStyle;
}

const MainContainer: React.FC<ContainerProps> = ({ children, ph = 0, center = false, style }) => {
  const theme = Theme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.base00,
          paddingHorizontal: ph,
          justifyContent: center ? 'center' : undefined,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

export default MainContainer;
