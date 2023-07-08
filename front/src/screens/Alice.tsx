import { Box, Button, Grid, Typography } from '@mui/material'

import { selectFiles, setFiles, setScreen } from '../redux/globalsSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { ChangeEvent, FormEvent, useCallback, useRef } from 'react'
import { BackendAPI, FileInfo } from '../BackendAPI'

import { FileList } from '../components/FileList'

const uuid = '123456-7890-1234-1234'

export default () => {
  const dispatch = useAppDispatch()
  const files: FileInfo[] = useAppSelector(selectFiles)

  const fileRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (
      !fileRef.current ||
      !fileRef.current.files ||
      !fileRef.current.files.length
    ) {
      console.log('No files are there')
      return
    }

    const formData = new FormData()
    ;[...fileRef.current.files].forEach((f: File) => {
      formData.append('filecontent', f)
    })
    console.log('handleSubmit', formData)
    BackendAPI.uploadFile(uuid, formData)
  }, [])

  const handleUploadListChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return
      const fileList: FileInfo[] = [...e.target.files].map((f) => ({
        name: f.name,
        size: f.size,
        file: f,
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
                // multiple
                hidden
                onChange={handleUploadListChange}
              />
            </Button>
          </Box>
        </Grid>
        {files.length ? <FileList files={files}></FileList> : null}
        <Grid item>
          <Box>
            <Button type="submit" variant="contained">
              Start transfer
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  )
}
