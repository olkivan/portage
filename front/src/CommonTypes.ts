export const VERIFY = (cond: any, message: string): any | never => {
  if (!cond) throw new Error(message)
  return cond
}
