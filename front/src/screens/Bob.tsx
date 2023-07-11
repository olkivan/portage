import { Box, Button, Grid, Typography } from '@mui/material'

import { selectFiles, setScreen } from '../redux/globalsSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { FileInfo } from '../BackendAPI'
import { FileList } from '../components/FileList'

function downloadFile(href: string) {
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = href

  document.body.appendChild(link)
  link.click()

  // To make this work on Firefox we need to wait
  // a little while before removing it.
  setTimeout(() => {
    link.parentNode?.removeChild(link)
  }, 0)
}

export default () => {
  const dispatch = useAppDispatch()
  const files: FileInfo[] = useAppSelector(selectFiles)

  return (
    <>
      <Grid>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4">Bob</Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            onClick={() => dispatch(setScreen('main'))}
          >
            Switch to Main page
          </Button>
        </Box>
        {files.length ? (
          <>
            <FileList />
            <Box>
              <Button
                variant="contained"
                onClick={() =>
                  downloadFile(
                    'http://localhost:3001/api/v1/download/123456-7890-1234-1234'
                  )
                }
              >
                Download
              </Button>
            </Box>
          </>
        ) : null}
      </Grid>
    </>
  )
}
