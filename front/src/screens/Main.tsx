import { Box, Button, Grid, Typography } from '@mui/material'

import { Link } from 'react-router-dom'

export default () => {
  return (
    <>
      <Grid>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4">I want to</Typography>
        </Box>

        <Box>
          <Link to="/portage/upload" style={{ textDecoration: 'none' }}>
            <Button
              sx={{ m: 2, width: '10rem' }}
              variant="contained"
              color="primary"
            >
              Transfer files
            </Button>
          </Link>
          <Link to="/portage/download" style={{ textDecoration: 'none' }}>
            <Button
              sx={{ m: 2, width: '10rem' }}
              variant="contained"
              color="secondary"
            >
              Receive files
            </Button>
          </Link>
        </Box>
      </Grid>
    </>
  )
}
