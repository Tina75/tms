import cityUtil from 'ydd_area'
import mapCache from 'ydd_area/area.min.js'
const {
  getAllChild,
  getParentByCode,
  getPathByCode
} = cityUtil
/**
 * 配合iview级联组件查询的
 * @param {string} name 关键字
 */
export const searchByNameForCasecader = function (name) {
  if (!name) {
    return []
  }
  let matched = []
  for (let code in mapCache) {
    if (code === 'specialCodeMap' || code === '-1' || code === '0') {
      continue
    }
    let area = mapCache[code]
    // 港澳台地区特殊处理，不加载子区
    if (area.parent === '810000' || area.parent === '710000' || area.parent === '820000') {
      continue
    }
    if (area.name.match(name)) {
      matched.unshift(area)
    }
  }
  let existMap = {}
  let areas = []
  var loopSearchAllChildren = function (item) {
    existMap[item.code] = true
    let children = getAllChild(item.code)
    children.forEach(child => {
      existMap[child.code] = true
      let record = {
        label: item.name + '/' + child.name,
        value: item.code + ',' + child.code,
        display: item.name + '/' + child.name,
        code: child.code,
        name: item.name + '/' + child.name,
        hasChild: child.hasChild,
        item: child,
        disabled: false
      }
      areas.push(record)
      if (child.hasChild) {
        loopSearchAllChildren(record)
      }
    })
  }
  // 先排序，让省，市先读取出来，这样下面的命中区不循环再查了
  matched.sort((a, b) => a.code - b.code).forEach((item) => {
    if (existMap[item.code]) {
      return
    }
    if (item.hasChild && item.parent === '0') {
      // 省
      loopSearchAllChildren(item)
    } else if (item.hasChild && item.parent && item.parent !== '0') {
      // 市
      let parent = getParentByCode(item.code)
      existMap[parent.code] = true
      let record = {
        label: parent.name + '/' + item.name,
        value: parent.code + ',' + item.code,
        display: parent.name + '/' + item.name,
        code: item.code,
        hasChild: item.hasChild,
        name: parent.name + '/' + item.name,
        disabled: false,
        item: item
      }
      areas.push(record)
      loopSearchAllChildren(record)
    } else {
      // 区
      let items = getPathByCode(item.code)
      let temp = {}
      items.forEach((child) => {
        existMap[child.code] = true
        temp.label = temp.label ? temp.label + '/' + child.name : child.name
        temp.value = temp.value ? temp.value + ',' + child.code : child.code
        temp.code = temp.value
        temp.display = temp.label
        temp.disabled = false
        temp.item = child
      })
      areas.push(temp)
    }
  })
  return areas
}
/**
 * 芜湖市 芜湖县
 * 市和县同名只匹配第一个BUG
 */
var REVERSED
export const getCodeByName = function (cityName) {
  if (!cityName) return '110100'
  cityName = String(cityName).replace(
    /(特别行政区|自治州|自治区|省)$/,
    ''
  )
  var cityId = '110100'
  if (!REVERSED) {
    REVERSED = Object.keys(mapCache).reverse()
  }
  try {
    cityId =
      REVERSED.find(function (city) {
        return mapCache[city].name && mapCache[city].name.match(cityName)
      }) || '110100'
  } catch (e) {
    console.error('[getCodeByName] error ', e)
  }
  return cityId
}
export const U = {
  ...cityUtil
}

export default cityUtil
