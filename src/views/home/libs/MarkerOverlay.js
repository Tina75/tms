/**
 * 自定义地图标注点样式
 */
import BMap from 'BMap'
export default class MarkerOverlay extends BMap.Overlay {
  constructor (point) {
    super(point)
    this._point = point
  }

  initialize (map) {
    this._map = map
    const div = this._div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat)
    div.style.backgroundColor = 'rgba(0, 164, 189, .1)'
    div.style.padding = '10px'
    div.style.MozUserSelect = 'none'
    div.style.borderRadius = '50%'
    const dot = document.createElement('div')
    dot.style.position = 'absolute'
    dot.style.zIndex = BMap.Overlay.getZIndex(this._point.lat)
    dot.style.backgroundColor = '#00A4BD'
    dot.style.padding = '3px'
    dot.style.margin = '7px'
    dot.style.top = dot.style.left = '0'
    dot.style.borderRadius = '50%'
    div.appendChild(dot)
    map.getPanes().labelPane.appendChild(div)
    return div
  }
  draw () {
    const map = this._map
    var pixel = map.pointToOverlayPixel(this._point)
    this._div.style.left = pixel.x - 10 + 'px'
    this._div.style.top = pixel.y - 10 + 'px'
  }
};
