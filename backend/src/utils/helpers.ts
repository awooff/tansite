

export const removeFromObject = (obj: any, keys: any[]) => {
  let newObj = {} as any;
  Object.keys(obj).filter((key) => keys.includes(key)).forEach((key) => {
    newObj[key] = obj[key];
  })
  return newObj;
}