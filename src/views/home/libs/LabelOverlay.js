/**
 * 自定义地图标文字提示样式
 */
import BMap from 'BMap'
export default class LabelOverlay extends BMap.Overlay {
  constructor (point, text) {
    super(point)
    this._point = point
    this._text = text
  }

  initialize (map) {
    this._map = map
    const div = this._div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.color = '#fff'
    div.style.width = '72px'
    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat)
    div.style.backgroundColor = '#00A4BD'
    div.style.border = '1px solid #00A4BD'
    div.style.padding = '5px'
    div.style.MozUserSelect = 'none'
    div.style.borderRadius = '4px'
    div.style.fontSize = '12px'
    div.style.height = '22px'
    div.style.padding = '0 5px'
    div.style.lineHeight = '20px'

    const span = this._span = document.createElement('span')
    span.appendChild(document.createTextNode(this._text))
    div.appendChild(span)

    const arrow = this._arrow = document.createElement('div')
    // arrow.style.background = 'url(http://map.baidu.com/fwmap/upload/r/map/fwmap/static/house/images/label.png) no-repeat'
    arrow.style.position = 'absolute'
    arrow.style.width = '0'
    arrow.style.height = '0'
    arrow.style.borderLeft = '5px solid transparent'
    arrow.style.borderRight = '5px solid transparent'
    arrow.style.borderTop = '5px solid #00A4BD'
    arrow.style.top = '20px'
    arrow.style.left = '29px'
    arrow.style.padding = '0'

    div.appendChild(arrow)

    map.getPanes().labelPane.appendChild(div)
    return div
  }
  draw () {
    const map = this._map
    var pixel = map.pointToOverlayPixel(this._point)
    this._div.style.left = (pixel.x - 30) + 'px'
    this._div.style.top = (pixel.y - 30) + 'px'
  }
};
