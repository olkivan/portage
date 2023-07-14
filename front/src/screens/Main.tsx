import { Box, Button, Grid, Typography } from '@mui/material'

import { Link } from 'react-router-dom'

export default () => {
  return (
    <>
      <Grid>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4">Main Page</Typography>
        </Box>

        <Box>
          <Link to="/upload" style={{ textDecoration: 'none' }}>
            <Button sx={{ m: 2 }} variant="contained" color="primary">
              Switch to Alice
            </Button>
          </Link>
          <Link to="/download" style={{ textDecoration: 'none' }}>
            <Button sx={{ m: 2 }} variant="contained" color="secondary">
              Switch to Bob
            </Button>
          </Link>
        </Box>
      </Grid>
    </>
  )
}
