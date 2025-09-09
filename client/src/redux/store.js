import { configureStore } from '@reduxjs/toolkit';

import ui from './reducers/ui/slice';
import user from './reducers/user/slice';

const store = configureStore({
  reducer: { ui, user },
});

export default store;
