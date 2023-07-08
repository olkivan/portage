import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from './store'
import { Screen } from '../CommonTypes'
import { FileInfo } from '../BackendAPI'

export type AppGlobals = {
  screen: Screen
  files: FileInfo[]
}

const initialState: AppGlobals = {
  screen: 'alice',
  files: [],
}

export const globalsSlice = createSlice({
  name: 'globals',
  initialState,
  reducers: {
    setScreen: (state, action: PayloadAction<Screen>) => {
      state.screen = action.payload
    },
    setFiles: (state, action: PayloadAction<FileInfo[]>) => {
      state.files = action.payload
    },
  },
})

export const { setScreen, setFiles } = globalsSlice.actions
export const selectScreen = (state: RootState) => state.globals.screen
export const selectFiles = (state: RootState) => state.globals.files
export default globalsSlice.reducer
