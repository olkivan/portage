import { configureStore } from '@reduxjs/toolkit'
import globalsReducer from './globalsSlice'

export const store = configureStore({
  reducer: {
    globals: globalsReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
