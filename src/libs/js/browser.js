/**
 * 判断浏览器模式
 */
const browser = (function () {
  let agent = navigator.userAgent.toLowerCase()
  let opera = window.opera
  let browser = {
    ie: /(msie\s|trident.*rv:)([\w.]+)/i.test(agent),
    opera: !!opera && opera.version,
    webkit: agent.indexOf(' applewebkit/') > -1,
    mac: agent.indexOf('macintosh') > -1,
    // 怪异模式
    quirks: document.compatMode === 'BackCompat'
  }
  browser.gecko =
    navigator.product === 'Gecko' &&
    !browser.webkit &&
    !browser.opera &&
    !browser.ie
  /**
   * 是ie浏览器，判断ie系列
   */
  if (browser.ie) {
    browser.ie11Compat = document.documentMode === 11
    browser.ie10Compat = document.documentMode === 10
    browser.ie9Compat = document.documentMode === 9
  }
  if (/chrome\/(\d+\.\d)/i.test(agent)) {
    browser.chrome = +RegExp['\x241']
  }
  if (
    /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(agent) &&
    !/chrome/i.test(agent)
  ) {
    browser.safari = +(RegExp['\x241'] || RegExp['\x242'])
  }
  return browser
})()

export default browser
