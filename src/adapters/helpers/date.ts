export const now = ({ location = 'en-US', timeZone = 'America/Sao_Paulo'} = {}) => {
  const nDate = new Date().toLocaleString(location, {
    timeZone
  });
  return new Date(nDate)
}