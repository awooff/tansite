export const removeFromObject = (obj: any, keys: any[]) => {
  const newObj = {} as any
  Object.keys(obj).filter((key) => !keys.includes(key)).forEach((key) => {
    newObj[key] = obj[key]
  })
  return newObj
}
