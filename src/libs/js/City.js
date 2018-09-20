import mapCache from 'area-data'

var treeCache = []
var china = {
  name: '全国',
  code: '0',
  lon: '0',
  lat: '0'
}

/**
 * 通过city的code来获取城市的名称
 * @param code 城市code
 */
var codeToName = function (code) {
  var name = ''
  if (mapCache[ code ]) {
    name = mapCache[ code ].name
  }
  return name
}
// 将codes转化为，如：辽宁省(沈阳市,大连市);吉林省(长春市,吉林市,四平市)
var codesToDisplay = function (cityCodes) {
  cityCodes = cityCodes || []
  var all = {}
  cityCodes.forEach(function (code) {
    if (!code) return
    code = code.toString()
    var pcode = code.substring(0, 2) + '0000'
    var pname = codeToName(pcode)
    var cname = codeToName(code)
    if (pname && cname) {
      var p = all[ pname ] ? all[ pname ] : (all[ pname ] = [])
      if (pname !== cname) { p.push(cname) }
    }
  })
  var names = []
  for (var pn in all) {
    var citys = (all[ pn ] && all[ pn ].length > 0) ? `(${all[ pn ].join(',')})` : ''
    names.push(`${pn}${citys}`)
  }
  return names.join(';')
}
/**
 * 通过city的code来获取城市的名称
 * 可以通过下面的 getPathByCode 先查出路径信息
 * @param code 城市code
 * @param deep  1：省  2：市  3：区
 * @connChar connChar 链接符
 */
var codeToFullName = function (code, deep, connChar) {
  if (!code) return ''

  deep = deep || 4
  var str = []
  var paths = getPathByCode(code)
  for (var i = 0; i < paths.length; i++) {
    var obj = paths[ i ]
    if (i < deep) {
      str.push(obj.name)
    }
  }
  return str.join(connChar || ' ')
}

/**
 * 获取所有跟节点
 */
var getAllRoots = function () {
  var retval = []
  for (var i = 11; i < 100; i++) {
    var item = mapCache[ i + '0000' ];
    (item) && retval.push(item)
  }
  return retval
}

/**
 * 获取该节点的所有孩子节点信息
 * @param code
 * @returns {Array}
 */
var getAllChild = function (code) {
  // 查询正常子集
  if (!code) return getAllRoots()
  var codes = code.match(/\d{2}/gi)
  var index = -1
  var array = []
  for (var i = 0; i < codes.length; i++) {
    var obj = codes[ i ]
    if (obj === '00') {
      index = i
      break
    }
  }
  if (index > -1) {
    for (var j = 1; j < 100; j++) {
      var key = j < 10 ? '0' + j : j
      codes[ index ] = key
      key = codes.join('')
      if (mapCache[ key ]) {
        array.push(mapCache[ key ])
      }
    }
  }
  // special citys
  const speicalCitys = mapCache['specialCodeMap']
  // const speicalCitys = {
  //   '410000': [
  //     '419001'
  //   ],
  //   '420000': [
  //     '429004',
  //     '429005',
  //     '429006',
  //     '429021'
  //   ],
  //   '460000': [
  //     '469001',
  //     '469002',
  //     '469003',
  //     '469005',
  //     '469006',
  //     '469007',
  //     '469021',
  //     '469022',
  //     '469023',
  //     '469024',
  //     '469025',
  //     '469026',
  //     '469027',
  //     '469028',
  //     '469029',
  //     '469030',
  //     '469031',
  //     '469032',
  //     '469033'
  //   ],
  //   '650000': [
  //     '659001',
  //     '659002',
  //     '659003',
  //     '659004'
  //   ]
  // }
  if (speicalCitys[ code ] && speicalCitys[ code ] instanceof Array) array = array.concat(speicalCitys[ code ].map(c => mapCache[ c ]))
  return array
}

/**
 * 获取一个对象。这个对象是以 code为key。value为具体城市信息。 value 格式如下(去掉多余的字段)
 *   {
      "name": "呼玛县",
      "code": "232721",
      "lon": "126.665314",
      "lat": "51.725639"
 *   }
 * @returns {*}
 */
// var getKeyToValueMap = function () {
//   return mapCache
// }

/**
 * 获取扁平的结构的数据 如下, 基础数据 key value parent(存在父节点才会有)
 * @returns {Array}
 *  [
 {
     "name": "湖北省",
     "value": "420000"
 },
 {
     "name": "神农架林区",
     "value": "429021",
     "parent": "420000"
 },
 *  ]
 */
var getFlatTree = function () {
  if (treeCache.length === 0) {
    for (var key in mapCache) {
      var temp = {}
      var data = mapCache[ key ]
      temp.value = data.code
      temp.name = data.name
      if (data.parent) {
        temp.parent = data.parent
      }
      treeCache.push(temp)
    }
    // 对只有二级城市做处理
    var ids = [ 820100, 810100, 710100 ]
    ids.forEach(function (one) {
      var aim = {}
      var data = mapCache[ one ]
      aim.name = '--'
      aim.value = data.code + '--'
      aim.parent = data.code
      treeCache.push(aim)
    })
  }

  return treeCache
}

/**
 * 通过code获取该路径下的所有节点信息
 * @param code 城市code
 * @returns {Array}
 *  [{
 *    "name":"全国",
 *    "code":"0",
 *    "lon":"0",
 *    "lat":"0"
 *  },{
 *    "name":"上海",
 *    "code":"0",
 *    "lon":"0",
 *    "lat":"0"
 *  }]
 */
var getPathByCode = function (code) {
  if (code === '0') { return [ china ] }
  var path = []
  if (code) {
    var data = mapCache[ code ]
    var push = function (data) {
      path.unshift(data)
      if (data.parent) {
        push(mapCache[ data.parent ])
      }
    }
    if (data) {
      push(data)
    } else {
      console.error('no city by code:' + code)
    }
  }
  return path
}

/**
 * 通过code获取当前对象
 * @param code 城市code
 */
var getItemByCode = function (code) {
  var data = mapCache[ code ]
  if (!data) {
    console.warn('no city by code:' + code)
  }
  return data
}

/**
 * 通过code获取父级对象
 * @param code 城市code
 */
var getParentByCode = function (code) {
  var item = mapCache[ code ]
  var retval
  if (!item) {
    console.warn('no city by code:' + code)
  }
  if (!item.parent) {
    console.warn('The node is the root node. code:' + code)
  } else {
    retval = mapCache[ item.parent ]
  }
  return retval
}

export default {
  codeToName,
  codesToDisplay,
  getPathByCode,
  getItemByCode,
  getParentByCode,
  getAllChild,
  getAllRoots,
  getFlatTree,
  getFullName: codeToFullName,
  codeToFullName,
  china
}
