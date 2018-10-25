/**
 * 自定义地图标注点样式
 */
import BMap from 'BMap'
export default class MarkerOverlay extends BMap.Overlay {
  constructor (point, clickCb) {
    super(point)
    this._point = point
    if (clickCb) this._clickCb = clickCb
  }

  initialize (map) {
    this._map = map
    const div = this._div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat)
    div.style.backgroundColor = '#00A4BD'
    div.style.border = '1px solid #00A4BD'
    div.style.padding = '5px'
    div.style.MozUserSelect = 'none'
    div.style.borderRadius = '50%'

    if (this._clickCb) {
      div.style.cursor = 'pointer'
      div.onclick = () => { this._clickCb() }
    }
    map.getPanes().labelPane.appendChild(div)
    return div
  }
  draw () {
    const map = this._map
    var pixel = map.pointToOverlayPixel(this._point)
    this._div.style.left = pixel.x - 5 + 'px'
    this._div.style.top = pixel.y - 5 + 'px'
  }
};
