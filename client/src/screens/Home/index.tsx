import React from 'react';
import { View, Text } from 'react-native';
import MainContainer from '~/components/Container';
import { styles } from './styles';
import CustomButton from '~/components/CustomButton';
import { useUserStore } from '~/store/userStore';
import { fonts } from '~/utils/fonts';

const Home = () => {
  const { clearUser } = useUserStore();
  return (
    <MainContainer ph={10}>
      <View>
        <Text style={styles.textStyle}>Home</Text>
      </View>

      <CustomButton
        onPress={clearUser}
        textColor="white"
        bgColor="grey"
        fontFam={fonts.Pr}
        fontsize={14}
        height={40}
        width={'100%'}
        disabled={false}
        text="clear"
      />
    </MainContainer>
  );
};

export default Home;
