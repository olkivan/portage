import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'

import { FileInfo } from '../BackendAPI'
import { useCallback } from 'react'
import { selectFiles, setFiles } from '../redux/globalsSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'

export const FileList = () => {
  const files: FileInfo[] = useAppSelector(selectFiles)

  const withUUID = !!files[0].uuid

  return (
    <TableContainer component={Paper}>
      <Table
        style={{ width: '100%', tableLayout: 'fixed' }}
        aria-label="file list table"
      >
        <TableHead>
          <TableRow>
            <TableCell
              width="50%"
              sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              Name
            </TableCell>
            <TableCell width="25%" align="right">
              Size
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map(({ name, size, uuid, selected }: FileInfo, i) => (
            <TableRow
              key={`${name}-${i}`}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell
                //component="th"
                scope="row"
                sx={{
                  wordWrap: 'break-word',
                }}
                width="50%"
              >
                {withUUID ? (
                  <a href={`http://localhost:3001/api/v1/download/${uuid}`}>
                    {name}
                  </a>
                ) : (
                  name
                )}
              </TableCell>
              <TableCell width="25%" align="right">
                {size}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
