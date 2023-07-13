import axios from 'axios'

export const API_URL = `http://localhost:3001/v1`

// TODO: better to split into two separate types FileInfo and FileInfoDto?
export type FileInfo = {
  uuid?: string
  name: string
  size: number
  requested?: boolean
  file?: File
}

type SessionDto = {
  pin: string
  filelist: {
    uuid: string
    name: string
    size: number
  }[]
}

type CreateSessionDto = {
  filelist: {
    name: string
    size: number
  }[]
}

async function createSession(
  files: FileInfo[]
): Promise<SessionDto | { error: string }> {
  const rurl = `${API_URL}/sessions`

  const data: CreateSessionDto = {
    filelist: files.map(({ file, ...fileInfo }) => fileInfo),
  }

  try {
    const response = await axios.post<SessionDto>(rurl, data)
    return response.data
  } catch (e: any) {
    return { error: `${e.message}\nRequest URL: ${rurl}` }
  }
}

async function getSession(
  pin: string
): Promise<SessionDto | { error: string }> {
  const rurl = `${API_URL}/sessions/${pin}`
  try {
    const response = await axios.get<SessionDto>(rurl)
    return response.data
  } catch (e: any) {
    return { error: `${e.message}\nRequest URL: ${rurl}` }
  }
}

async function uploadFile(
  pin: string,
  uuid: string,
  formData: FormData
): Promise<any> {
  console.log('BackendAPI.uploadFile')

  const err = (msg: string) => ({
    error: `uploadFile failed - ${msg}`,
  })
  if (!pin) return err(`invalid pin: ${pin}`)
  if (!uuid) return err(`invalid uuid: ${uuid}`)

  const rurl = `${API_URL}/files/${pin}/${uuid}`

  try {
    const response = await axios.post(rurl, formData)
    return response.data
  } catch (e: any) {
    return { error: `${e.message}\nRequest URL: ${rurl}` }
  }
}

async function downloadFile(pin: string, uuid: string): Promise<any> {
  const rurl = `${API_URL}/files/${pin}/${uuid}`

  try {
    const response = await axios.get(rurl)
    return response.data
  } catch (e: any) {
    return { error: `${e.message}\nRequest URL: ${rurl}` }
  }
}

export interface APIError {
  error: string
}

export const isAPIError = (entity: any): entity is APIError => {
  return (entity as APIError).error !== undefined
}

export const BackendAPI = {
  createSession,
  getSession,
  uploadFile,
  downloadFile,
}
