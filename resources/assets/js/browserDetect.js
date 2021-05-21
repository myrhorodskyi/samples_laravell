const { detect } = require('detect-browser')
const browser = detect()
import swal from 'sweetalert'

let browserName = browser.name,
  majorVersion = parseInt(browser.version)

switch (browser.name) {
  case('opera'):
    browserName = 'opera'
    break
  case('ie'):
    browserName = 'microsoft Internet Explorer'
    break
  case('Chrome'):
    browserName = 'chrome'
    break
  case('ios'):
    browserName = 'safari'
    break
  case('ios-webview'):
    browserName = 'safari'
    break
  case('safari'):
    browserName = 'safari'
    break
  case('firefox'):
    browserName = 'firefox'
    break
  case('fxios'):
    browserName = 'firefox'
    break
}

export function getData () {
  return {
    browser_name: browserName,
    major_version: majorVersion,
    app_name: navigator.appName,
    user_agent: navigator.userAgent,
    platform: window.navigator.platform
  }
}

export function checkBrowserSupport () {
  const data = getData()

  return ((data.browser_name === 'chrome' && data.major_version < 52) ||
    (data.browser_name === 'microsoft Internet Explorer' && data.major_version < 11) ||
    (data.browser_name === 'firefox' && data.major_version < 52) ||
    (data.browser_name === 'safari' && data.major_version < 11) ||
    (data.browser_name === 'opera' && data.major_version < 48))
}

export function screenShareSupport () {
  const data = getData()
  return ((data.browser_name === 'chrome' && data.major_version < 52) ||
    (data.browser_name === 'microsoft Internet Explorer' && data.major_version < 11) ||
    (data.browser_name === 'firefox' && data.major_version < 52) ||
    (data.browser_name === 'safari') ||
    (data.browser_name === 'opera' && data.major_version < 48))
}

export function getBrowserSupportModal () {
  if (this.checkBrowserSupport()) {
    return swal({
      className: '',
      title: 'Your browser version is incompatible with the site.',
      text: 'Please upgrade your browser to the latest version.',
      type: 'warning',
      icon: 'warning',
      showCancelButton: true
    })
  }
}

