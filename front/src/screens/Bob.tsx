import { Box, Button, Grid } from '@mui/material'

import { selectFiles, setScreen } from '../redux/globalsSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { FileInfo } from '../BackendAPI'
import { FileList } from '../components/FileList'

import PinCode from '../components/PinCode'

export default () => {
  const dispatch = useAppDispatch()
  const files: FileInfo[] = useAppSelector(selectFiles)

  return (
    <>
      <Grid>
        <Box>
          <PinCode />
          {files.length ? <FileList></FileList> : null}
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
    </>
  )
}
