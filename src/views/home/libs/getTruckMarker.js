import BMap from 'BMap'
import truckimg from '../../../assets/location-truck.png'

/**
 * new BMap.point()
 * 根据线路调转车头方向
 * @param {BMap.Point} startPoint
 * @param {BMap.Point} endPoint
 */
const truckerMarker = (bmap) => {
  return (startPoint, endPoint) => {
    if (!startPoint) {
      throw new Error('不合法的地理坐标信息')
    }
    const myIcon = new BMap.Icon(truckimg, new BMap.Size(28, 58))
    myIcon.setImageSize(new BMap.Size(28, 58))
    const marker = new BMap.Marker(startPoint, { icon: myIcon })
    if (endPoint instanceof BMap.Point) {
      let startPixel = bmap.pointToPixel(startPoint)
      let endPixel = bmap.pointToPixel(endPoint)
      let deg = 0

      let disx = endPixel.x - startPixel.x
      let disy = endPixel.y - startPixel.y
      deg = 360 * Math.atan2(disy, disx) / (2 * Math.PI) + 90
      marker.setRotation(deg)
    } else {
      // 单个坐标点
      marker.setRotation(90)
    }
    return marker
  }
}

export default truckerMarker
