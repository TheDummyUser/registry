import { useMutation } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';

import { styles } from './styles';

import { checkTimer, startTimer, stopTimer } from '~/apiconfig/services';
import MainContainer from '~/components/Container';
import CustomButton from '~/components/CustomButton';
import { useUserStore } from '~/store/userStore';
import { Theme } from '~/utils/colors';
import { fonts } from '~/utils/fonts';

const Home = () => {
  const { user } = useUserStore();
  const theme = Theme();

  const [timerData, setTimerData] = useState<any>(null);

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  const checkMutation = useMutation({
    mutationFn: checkTimer,
    onSuccess: (data) => {
      console.log('Success', data);
      setTimerData(data);
      const initialElapsedTime =
        data.details.ellapsed.hours * 3600 +
        data.details.ellapsed.minutes * 60 +
        data.details.ellapsed.seconds;
      setElapsedSeconds(initialElapsedTime);
    },
    onError: (error) => {
      console.log('Error', error.message);
    },
  });

  const startMutation = useMutation({
    mutationFn: startTimer,
    onSuccess: (data) => {
      console.log('Success', data);
      checkMutation.mutate(user?.id);
    },
    onError: (error) => {
      console.log('Error', error.message);
    },
  });

  const stopMutation = useMutation({
    mutationFn: stopTimer,
    onSuccess: (data) => {
      console.log('Success', data);
      checkMutation.mutate(user?.id);
    },
    onError: (error) => {
      console.log('Error', error.message);
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (timerData) {
        setElapsedSeconds((prev) => prev + 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timerData]);
  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <MainContainer ph={10}>
      <View style={{ height: 200 }}>
        <Text style={[styles.textStyle, { fontFamily: fonts.Pr }]}>Timer</Text>
        {checkMutation.isPending ? (
          <Text style={styles.textStyle}>Loading timer...</Text>
        ) : checkMutation.isError ? (
          <Text style={styles.errorText}>{checkMutation.error.message}</Text>
        ) : timerData ? (
          <>
            <Text style={styles.textStyle}>{timerData.message}</Text>
            <Text style={styles.textStyle}>Elapsed Time: {formatElapsedTime(elapsedSeconds)}</Text>
            <Text style={styles.textStyle}>
              Start Time: {new Date(timerData.details.start_time).toLocaleString()}
            </Text>
          </>
        ) : (
          <Text style={styles.textStyle}>No timer data available</Text>
        )}
      </View>

      <View style={{ height: 200, justifyContent: 'space-evenly' }}>
        <CustomButton
          textColor={theme.base07}
          onPress={() => checkMutation.mutate(user?.id)} // Trigger checkTimer mutation
          fontFam={fonts.Pr}
          fontsize={24}
          height={50}
          width="100%"
          bgColor={theme.base09}
          disabled={false}
          text="Check Timer"
        />

        <CustomButton
          textColor={theme.base07}
          onPress={() => startMutation.mutate(user?.id)} // Trigger startTimer mutation
          text="Start Timer"
          fontFam={fonts.Pr}
          fontsize={22}
          height={50}
          width="100%"
          bgColor={theme.base08}
          disabled={false}
        />

        <CustomButton
          textColor={theme.base07}
          onPress={() => stopMutation.mutate(user?.id)} // Trigger stopTimer mutation
          text="Stop Timer"
          fontFam={fonts.Pr}
          fontsize={22}
          height={50}
          width="100%"
          bgColor={theme.base08}
          disabled={false}
        />
      </View>
    </MainContainer>
  );
};

export default Home;
