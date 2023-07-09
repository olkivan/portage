import { configureStore } from '@reduxjs/toolkit'
import globalsReducer from './globalsSlice'

export const store = configureStore({
  reducer: {
    globals: globalsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
