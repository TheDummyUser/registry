import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-native-gesture-handler';

import RootStack from '~/navigation';

const queryClients = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClients}>
      <RootStack />
    </QueryClientProvider>
  );
}
