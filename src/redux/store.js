import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slice/auth';
import { postsRuducer } from './slice/posts';

const store = configureStore({
  reducer: {
    posts: postsRuducer,
    auth: authReducer,
  },
});

export { store };
