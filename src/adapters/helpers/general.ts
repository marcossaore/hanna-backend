export const generateRandomString = (length: number) => {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let randomString = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    randomString += charset[randomIndex]
  }

  return randomString
}

export const generateRandomInteger = (min: number, max: number) => {
  return Math.round(Math.random() * (max - min) + min)
}

export const convertToFloatWithTwoDecimals = (value: number): number => {
  const floatValue = value / 100
  const formattedValue = floatValue.toFixed(2)
  return Number(formattedValue)
}

export const convertFloatToInt = (floatValue: number): number => {
  const intValue = Math.round(floatValue * 100)
  return intValue
}
