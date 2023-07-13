import { Box, Button, Grid, Typography } from '@mui/material'

import {
  selectFiles,
  setFiles,
  setScreen,
  setPin,
  selectPin,
} from '../redux/globalsSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { ChangeEvent, FormEvent, useCallback, useRef } from 'react'
import { BackendAPI, FileInfo } from '../BackendAPI'

import { FileList } from '../components/FileList'
import { VERIFY } from '../CommonTypes'

export default () => {
  const dispatch = useAppDispatch()
  const files: FileInfo[] = useAppSelector(selectFiles)
  const pin: string = useAppSelector(selectPin)

  const fileRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      VERIFY(files.length, 'No files are there')

      const session = await BackendAPI.createSession(files)
      if ('error' in session) {
        console.log(session.error)
        return
      }

      const { pin, filelist } = session

      dispatch(setPin(pin))

      // Populate files info with uuids
      const filesWithUUID = files.map((fileInfo, i) => {
        VERIFY(fileInfo.name === filelist[i].name, 'File name mismatch')

        return {
          ...fileInfo,
          ...filelist[i],
        }
      })

      filesWithUUID.map(({ name, file, uuid }) => {
        VERIFY(uuid, `File has no uuid: ${uuid} ${name}`)
        VERIFY(file, `File object is empty: ${uuid} ${name}`)

        const formData = new FormData()
        formData.append('filecontent', file!)
        BackendAPI.uploadFile(pin, uuid, formData)
      })

      dispatch(setFiles(filesWithUUID))
    },
    [files]
  )

  const handleUploadListChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return
      const fileList: FileInfo[] = [...e.target.files].map((f) => ({
        name: f.name,
        size: f.size,
        file: f,
        selected: true,
      }))

      dispatch(setFiles(fileList))
    },
    []
  )

  return (
    <form onSubmit={handleSubmit}>
      <Grid>
        <Grid item>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4">Alice</Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              onClick={() => dispatch(setScreen('main'))}
            >
              Switch to Main page
            </Button>
          </Box>
        </Grid>
        <Grid item>
          <Box>
            <Button variant="contained" component="label">
              Choose files to transfer...
              <input
                type="file"
                ref={fileRef}
                id="files_to_upload"
                name="files_to_upload"
                multiple
                hidden
                onChange={handleUploadListChange}
              />
            </Button>
          </Box>
        </Grid>
        {files.length ? <FileList></FileList> : null}
        {pin ? (
          <Grid item>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h5">PIN: {pin}</Typography>
              <Typography variant="h6">(share it with other party)</Typography>
            </Box>
          </Grid>
        ) : (
          <Grid item>
            <Box sx={{ mt: 2 }}>
              <Button type="submit" variant="contained">
                Start transfer
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </form>
  )
}
