import { Box, Button, Grid, Typography } from '@mui/material'

import { setScreen } from '../redux/globalsSlice'
import { useAppDispatch } from '../redux/hooks'

export default () => {
  const dispatch = useAppDispatch()

  return (
    <>
      <Grid>
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
    </>
  )
}
