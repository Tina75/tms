/**
 * 自定义地图标文字提示样式
 * 不要使用ES6-class写，IE10以下会找不到原型链上的方法而报错
 */
import BMap from 'BMap'

function LabelOverlay (point, text) {
  this._point = point
  this._text = text
}

LabelOverlay.prototype = new BMap.Overlay()

LabelOverlay.prototype.initialize = function (map) {
  this._map = map
  const div = this._div = document.createElement('div')
  div.style.position = 'absolute'
  div.style.color = '#fff'
  div.style.width = (this._text.length === 11 ? 100 : 75) + 'px'
  div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat)
  div.style.backgroundColor = '#00A4BD'
  div.style.border = '1px solid #00A4BD'
  div.style.padding = '5px'
  div.style.MozUserSelect = 'none'
  div.style.borderRadius = '4px'
  div.style.fontSize = '12px'
  div.style.fontWeight = 'bolder'
  div.style.height = '22px'
  div.style.padding = '0 5px'
  div.style.lineHeight = '20px'
  div.style.textAlign = 'center'

  const span = this._span = document.createElement('span')
  span.style.display = 'block'
  span.style.width = span.style.height = '100%'
  span.appendChild(document.createTextNode(this._text))
  div.appendChild(span)

  const arrow = this._arrow = document.createElement('div')
  arrow.style.position = 'absolute'
  arrow.style.width = '0'
  arrow.style.height = '0'
  arrow.style.borderLeft = '5px solid transparent'
  arrow.style.borderRight = '5px solid transparent'
  arrow.style.borderTop = '5px solid #00A4BD'
  arrow.style.top = '20px'
  arrow.style.left = '25px'
  arrow.style.padding = '0'

  div.appendChild(arrow)

  map.getPanes().labelPane.appendChild(div)
  return div
}

LabelOverlay.prototype.draw = function () {
  const map = this._map
  var pixel = map.pointToOverlayPixel(this._point)
  this._div.style.left = (pixel.x - 31) + 'px'
  this._div.style.top = (pixel.y - 42) + 'px'
}

export default LabelOverlay
