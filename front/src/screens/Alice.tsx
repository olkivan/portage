import { Box, Button, Grid, Typography } from '@mui/material'

import { selectFiles, setFiles, setScreen } from '../redux/globalsSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { ChangeEvent, FormEvent, useCallback, useRef, useState } from 'react'
import { BackendAPI, FileInfo, isAPIError } from '../BackendAPI'

import { FileList } from '../components/FileList'

const uuid = '123456-7890-1234-1234'

export default () => {
  const dispatch = useAppDispatch()
  const files: FileInfo[] = useAppSelector(selectFiles)
  const [pin, setPin] = useState('')

  const fileRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!files.length) {
        console.log('No files are there')
        return
      }

      const session = await BackendAPI.createSession(files)
      if (isAPIError(session)) {
        console.log(session.error)
        return
      }

      const { pin, filelist } = session

      setPin(pin)

      // Populate files info with uuids
      const filesWithUUID = files.map((fileInfo, i) => {
        if (fileInfo.name != filelist[i].name) {
          throw new Error('File name mismatch')
        }
        return {
          ...fileInfo,
          ...filelist[i],
        }
      })

      filesWithUUID.map(({ name, file, uuid }) => {
        if (!uuid) throw new Error(`File has no uuid: ${uuid} ${name}`)
        if (!file) throw new Error(`File object is empty: ${uuid} ${name}`)

        const formData = new FormData()
        formData.append('filecontent', file)
        BackendAPI.uploadFile(uuid, formData)
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
