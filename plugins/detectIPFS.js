/* eslint-disable no-console */
export default ({ store, isHMR, app }, inject) => {
  inject('isLoadedFromIPFS', main)
}
function main() {
  const whiteListedDomains = ['localhost:3000', 'mishmash.cash']

  if (!whiteListedDomains.includes(window.location.host)) {
    console.warn('The page has been loaded from ipfs.io. LocalStorage is disabled')
    return true
  }

  return false
}
