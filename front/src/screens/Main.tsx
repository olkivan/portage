import { Box, Button, Grid, Typography } from '@mui/material'

import { setScreen } from '../redux/globalsSlice'
import { useAppDispatch } from '../redux/hooks'

export default () => {
  const dispatch = useAppDispatch()

  return (
    <>
      <Grid>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4">Main Page</Typography>
        </Box>
        <Box>
          <Button
            sx={{ m: 2 }}
            variant="contained"
            color="primary"
            onClick={() => dispatch(setScreen('alice'))}
          >
            Switch to Alice
          </Button>
          <Button
            sx={{ m: 2 }}
            variant="contained"
            color="secondary"
            onClick={() => dispatch(setScreen('bob'))}
          >
            Switch to Bob
          </Button>
        </Box>
      </Grid>
    </>
  )
}
