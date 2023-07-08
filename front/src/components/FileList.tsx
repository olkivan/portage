import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  CircularProgressProps,
} from '@mui/material'

import { FileInfo } from '../BackendAPI'

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  )
}

export const FileList = ({ files }: { files: FileInfo[] }) => (
  <TableContainer component={Paper}>
    <Table aria-label="file list table">
      <TableHead>
        <TableRow>
          <TableCell>File name</TableCell>
          <TableCell align="right">File Size</TableCell>
          <TableCell align="center">Transfer progress</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {files.map(({ name, size }: FileInfo, i) => (
          <TableRow
            key={name}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {name}
            </TableCell>
            <TableCell align="right">{size}</TableCell>
            <TableCell align="center">
              <CircularProgressWithLabel value={42} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)
