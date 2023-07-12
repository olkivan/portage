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
import { selectFiles, selectPin, setFiles } from '../redux/globalsSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { useCallback } from 'react'

const Link = ({
  pin,
  uuid,
  name,
  onClickCb,
}: {
  pin: string
  uuid: string
  name: string
  onClickCb: (uuid: string) => void
}) => {
  return (
    <a
      href={`http://localhost:3001/api/v1/download/${pin}/${uuid}`}
      onClick={() => onClickCb(uuid)}
    >
      {name}
    </a>
  )
}

export const FileList = () => {
  const dispatch = useAppDispatch()
  const files: FileInfo[] = useAppSelector(selectFiles)
  const pin: string = useAppSelector(selectPin)

  const handleLinkClick = useCallback(
    (uuid: string) => {
      dispatch(
        setFiles(
          files.map((fileInfo: FileInfo) => {
            return {
              ...fileInfo,
              requested: fileInfo.uuid === uuid ? true : fileInfo.requested,
            }
          })
        )
      )
    },
    [files]
  )

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
          {files.map(({ name, size, uuid, requested }: FileInfo, i) => (
            <TableRow
              key={`${name}-${i}`}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell
                scope="row"
                sx={{
                  wordWrap: 'break-word',
                }}
                width="50%"
              >
                {pin && uuid && !requested ? (
                  <Link
                    {...{
                      pin,
                      uuid,
                      name,
                      onClickCb: handleLinkClick,
                    }}
                  />
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
