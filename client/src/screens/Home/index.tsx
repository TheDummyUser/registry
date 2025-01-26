import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import MainContainer from '~/components/Container';
import CustomButton from '~/components/CustomButton';
import { useUserStore } from '~/store/userStore';
import { fonts } from '~/utils/fonts';
import { styles } from './styles';
import { useMutation } from '@tanstack/react-query';
import { checkTimer } from '~/apiconfig/services';
import { Theme } from '~/utils/colors';

const Home = () => {
  const { user, clearUser } = useUserStore();
  const theme = Theme();
  const mutation = useMutation({
    mutationFn: checkTimer,
    onSuccess: (data) => {
      console.log('sucess', data);
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  const onSubmit = (data: number) => {
    mutation.mutate(data);
  };

  useEffect(() => {
    mutation.mutate(user?.id);
  }, []);

  return (
    <MainContainer ph={10}>
      <View style={{ borderWidth: 1, borderColor: 'red', height: 200 }}>
        <Text style={[styles.textStyle, { fontFamily: fonts.Pr }]}>Timer</Text>
        {mutation.error && <Text style={styles.errorText}>{mutation.error.message}</Text>}
      </View>

      <CustomButton
        textColor="red"
        onPress={clearUser}
        text="stop"
        fontFam={fonts.Pr}
        fontsize={22}
        height={40}
        width={'100%'}
        bgColor="green"
        disabled={false}
      />
    </MainContainer>
  );
};

export default Home;
