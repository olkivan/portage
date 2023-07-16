import { Box, Button, Grid, Typography } from '@mui/material'

import { selectFiles, selectPin } from '../redux/globalsSlice'
import { useAppSelector } from '../redux/hooks'
import { FileInfo } from '../BackendAPI'
import { FileList } from '../components/FileList'

import PinCode from '../components/PinCode'

export default () => {
  const pin: string = useAppSelector(selectPin)
  const files: FileInfo[] = useAppSelector(selectFiles)

  return (
    <>
      <Grid>
        {!pin && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4">Enter pin code:</Typography>
          </Box>
        )}
        <Box>
          <PinCode />
          {files.length ? <FileList enableLinks={true} /> : null}
        </Box>
      </Grid>
    </>
  )
}
