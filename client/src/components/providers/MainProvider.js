'use client';
import React from 'react';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient();

const MainProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
};

export default MainProvider;
