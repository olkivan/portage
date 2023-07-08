import axios from 'axios'

export const API_URL = `http://localhost:3001/api/v1`

// TODO: better to split into two separae types FileInfo and FileInfoDto?
export type FileInfo = {
  uuid?: string
  name: string
  size: number
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
  const rurl = `${API_URL}/session/create`

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

async function uploadFile(uuid: string, formData: FormData): Promise<any> {
  console.log('BackendAPI.uploadFile')
  const rurl = `${API_URL}/upload/${uuid}`

  if (!uuid) {
    return {
      error: `Request URL: ${rurl}. Can't upload file with uuid ${uuid}`,
    }
  }

  try {
    const response = await axios.post(rurl, formData)
    return response.data
  } catch (e: any) {
    return { error: `${e.message}\nRequest URL: ${rurl}` }
  }
}

async function downloadFile(uuid: string): Promise<any> {
  const rurl = `${API_URL}/download/${uuid}`

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
  uploadFile,
  downloadFile,
}