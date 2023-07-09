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
  Checkbox,
} from '@mui/material'

import { FileInfo } from '../BackendAPI'
import { useCallback } from 'react'
import { selectFiles, setFiles } from '../redux/globalsSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'

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

export const FileList = () => {
  const dispatch = useAppDispatch()
  const files: FileInfo[] = useAppSelector(selectFiles)

  const handleSelectedChange = useCallback(
    (uuid: string) => {
      const updatedFiles = files.map((f) => ({
        ...f,
        selected: f.uuid === uuid ? !f.selected : f.selected,
      }))
      dispatch(setFiles(updatedFiles))
    },
    [files]
  )

  const withUUID = !!files[0].uuid

  return (
    <TableContainer component={Paper}>
      <Table aria-label="file list table">
        <TableHead>
          <TableRow>
            <TableCell>File name</TableCell>
            <TableCell align="right">File Size</TableCell>
            <TableCell align="center">Transfer progress</TableCell>
            {withUUID && <TableCell align="center">Download</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map(({ name, size, uuid, selected }: FileInfo, i) => (
            <TableRow
              key={`${name}-${i}`}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {name}
              </TableCell>
              <TableCell align="right">{size}</TableCell>
              <TableCell align="center">
                <CircularProgressWithLabel value={42} />
              </TableCell>
              {uuid && (
                <TableCell align="center">
                  <Checkbox
                    checked={selected}
                    onChange={() => handleSelectedChange(uuid)}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
