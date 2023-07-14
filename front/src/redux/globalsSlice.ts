import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from './store'
import { FileInfo } from '../BackendAPI'

export type AppGlobals = {
  pin: string
  files: FileInfo[]
}

const initialState: AppGlobals = {
  pin: '',
  files: [],
}

export const globalsSlice = createSlice({
  name: 'globals',
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<FileInfo[]>) => {
      state.files = action.payload
    },
    setPin: (state, action: PayloadAction<string>) => {
      state.pin = action.payload
    },
  },
})

export const { setFiles, setPin } = globalsSlice.actions
export const selectFiles = (state: RootState) => state.globals.files
export const selectPin = (state: RootState) => state.globals.pin
export default globalsSlice.reducer
