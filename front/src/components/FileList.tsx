import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'

import { FileInfo, formatDownloadLink } from '../BackendAPI'
import { selectFiles, selectPin, setFiles } from '../redux/globalsSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { useCallback } from 'react'

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

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
    <a href={formatDownloadLink(pin, uuid)} onClick={() => onClickCb(uuid)}>
      {name}
    </a>
  )
}

export const FileList = ({ enableLinks }: { enableLinks: boolean }) => {
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
        <TableHead sx={{ th: { fontWeight: 'bold' } }}>
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
                {enableLinks && pin && uuid && !requested ? (
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
                {formatBytes(size)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
