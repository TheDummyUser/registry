import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Theme } from '~/utils/colors';
import { ContainerProps } from '~/utils/types';

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
