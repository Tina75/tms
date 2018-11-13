/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute, curRoute) => {
  const { name, path, query, meta } = newRoute
  let newList = [...list]
  if (newList.findIndex(item => routeEqual(item, newRoute)) >= 0) {
    // 已存在  替换
    const idx = newList.findIndex(item => routeEqual(item, newRoute))
    newList.splice(idx, 1, { name, path, query, meta })
    return newList
  } else {
    // 不存在 find当前tab位置并在其后面添加新tab
    const idx = newList.findIndex(item => item.path === curRoute.path)
    newList.splice(idx + 1, 0, { name, path, query, meta })
  }
  return newList
}
/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = function (route1, route2) {
  const query1 = route1.query || {}
  const query2 = route2.query || {}
  // return (route1.name === route2.name) && this.objEqual(params1, params2) && this.objEqual(query1, query2)
  return (route1.path === route2.path) && (query1.title === query2.title)
  // return (route1.name === route2.name) && this.objEqual(meta1, meta2)
}

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = function (obj1, obj2) {
  const keysArr1 = Object.keys(obj1)
  const keysArr2 = Object.keys(obj2)
  if (keysArr1.length !== keysArr2.length) return false
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true
  /* eslint-disable-next-line */
  else return !keysArr1.some(key => obj1[key] != obj2[key])
}

const numberMap = '零一二三四五六七八九'.split('') // 数字映射
const baseUnit = ['', '十', '百', '千'] // 基础单位
const sectionUnit = ['', '万', '亿'] // 每4位的分组单位
const floatUnit = ['角', '分'] // 小数单位
/**
 * 金额（9位及以下）转汉字
 * @param {Number | String} number 金额
 * @returns {String} 汉字金额
 */
export const money2chinese = (number) => {
  number = Number(number)
  if ((typeof number !== 'number') || isNaN(number) || number > 999999999) return ''

  if (number === 0 || number < 0.01) return '零元'

  let resultArr = ['元']
  const numStr = number.toString()
  let intStr = numStr

  // 小数部分转换
  if (numStr.indexOf('.') > -1) {
    const temp = numStr.split('.')
    const floatStr = temp[1]
    intStr = temp[0]
    let transferedFloatStr = ''
    const length = floatStr.length > 2 ? 2 : floatStr.length
    for (let i = 0; i < length; i++) {
      if (Number(floatStr.charAt(i))) {
        transferedFloatStr += (numberMap[Number(floatStr.charAt(i))] + floatUnit[i])
      }
    }
    resultArr = resultArr.concat(transferedFloatStr)
  }

  // 对整数部分每4位一组进行分组
  const intSectionArr = []
  let item = ''
  for (let i = intStr.length - 1; i > -1; i--) {
    item = intStr.charAt(i) + item
    if (item.length === 4 || i === 0) {
      intSectionArr.unshift(item)
      item = ''
    }
  }

  // 对每一个分组进行转换
  let transferedResult = []
  for (let i = 0; i < intSectionArr.length; i++) {
    let tempResult = []
    const currentArr = intSectionArr[i].split('')
    let currentArrLength = currentArr.length
    let canAddZero = true // 是否可以补零，防止出现连续多个0
    while (currentArrLength) {
      const num = Number(currentArr[0])
      if (num) {
        canAddZero = true
        tempResult.push(numberMap[num] + baseUnit[currentArrLength - 1])
      }
      if (!num && canAddZero) {
        canAddZero = false
        tempResult.push('零')
      }

      currentArr.shift()
      currentArrLength = currentArr.length
    }
    if (tempResult[tempResult.length - 1] === '零') tempResult.pop()
    transferedResult.push(tempResult.join(''))
  }

  // 为每一个分组添加单位
  for (let i = 0; i < transferedResult.length; i++) {
    resultArr.splice(i, 0, transferedResult[i] ? transferedResult[i] + sectionUnit[transferedResult.length - i - 1] : transferedResult[i])
  }

  // 口语化
  // 如果头两位为”一十“，则只保留”十“，如 一十一 => 十一
  if (resultArr[0].substr(0, 2) === '一十') resultArr[0] = resultArr[0].substr(1, resultArr[0].length)
  // 如果金额不足一元，则只展示小数部分，如 0.2 => 二角
  if (resultArr[0] === '' && resultArr[1] === '元') resultArr = resultArr.slice(2, resultArr.length)

  return resultArr.join('')
}
/**
 * 列表中费用格式化
 * @param {*} h
 * @param {*} value
 */
export const renderFee = (h, value) => {
  return h('span', {}, value ? (value / 100).toFixed(2) : '0.00')
}
