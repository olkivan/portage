import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from './store'
import { Screen } from '../CommonTypes'

export type AppGlobals = {
  screen: Screen
}

const initialState: AppGlobals = {
  screen: 'main',
}

export const globalsSlice = createSlice({
  name: 'globals',
  initialState,
  reducers: {
    setScreen: (state, action: PayloadAction<Screen>) => {
      state.screen = action.payload
    },
  },
})

export const { setScreen } = globalsSlice.actions
export const selectScreen = (state: RootState) => state.globals.screen
export default globalsSlice.reducer
