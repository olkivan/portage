import { Box, Button, Grid } from '@mui/material'

import { selectFiles } from '../redux/globalsSlice'
import { useAppSelector } from '../redux/hooks'
import { FileInfo } from '../BackendAPI'
import { FileList } from '../components/FileList'

import PinCode from '../components/PinCode'
import { Link } from 'react-router-dom'

export default () => {
  const files: FileInfo[] = useAppSelector(selectFiles)

  return (
    <>
      <Grid>
        <Box>
          <PinCode />
          {files.length ? <FileList enableLinks={true} /> : null}
        </Box>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button variant="contained">Switch to Main page</Button>
        </Link>
      </Grid>
    </>
  )
}
