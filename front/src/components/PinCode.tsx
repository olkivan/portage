import { useCallback, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
import PinField from 'react-pin-field'
import { BackendAPI } from '../BackendAPI'
import clsx from 'clsx'

import { useAppDispatch } from '../redux/hooks'
import { setFiles, setPin } from '../redux/globalsSlice'

import './PinCode.scss'

const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <>
      <Box sx={{ flexDirection: 'column', width: '100%' }}>
        <Typography variant="subtitle2" align="center" color="red">
          {message}
        </Typography>
      </Box>
    </>
  )
}

const StatusMessage = ({ message }: { message: string }) => {
  return (
    <>
      <Box sx={{ flexDirection: 'column', width: '100%' }}>
        <Typography variant="h6" align="center" color="green">
          {message}
        </Typography>
      </Box>
    </>
  )
}

export default () => {
  const [completed, setCompleted] = useState(false)
  const ref = useRef<HTMLInputElement[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const dispatch = useAppDispatch()

  const handleComplete = useCallback(
    async (pin: string) => {
      setCompleted(true)

      const session = await BackendAPI.getSession(pin)
      if ('error' in session) {
        ref.current.forEach((input) => (input.value = '')) // clear input boxes
        setErrorMessage(session.error)
        setCompleted(false)
        return
      }

      setStatusMessage(`Pin ${pin} is valid`)
      dispatch(setPin(pin))
      dispatch(setFiles(session.filelist))
    },
    [dispatch]
  )

  const handleChange = useCallback(() => setErrorMessage(''), [])

  return (
    <>
      <Box className="pin-field-container">
        <PinField
          ref={ref}
          length={6}
          className={clsx('pin-field', { complete: completed })}
          onComplete={handleComplete}
          onChange={handleChange}
          format={(k) => k.toUpperCase()}
          autoFocus
          disabled={completed}
          validate={/\d+/}
          autoComplete="one-time-password"
        />
      </Box>
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {statusMessage && <StatusMessage message={statusMessage} />}
    </>
  )
}
