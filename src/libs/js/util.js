
// /**
//  * @description 切换tab标签
//  * @param {*} route 跳转目标的path或route对象
//  */
// var turnToPage = function (route) {
//   let { path, params, query, meta } = {}
//   if (typeof route === 'string') path = route
//   else {
//     path = route.path
//     params = route.params
//     query = route.query
//     meta = route.meta
//   }
//   this.$router.push({ path, params, query, meta })
// }
/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const { name, path, query, meta } = newRoute
  let newList = [...list]
  // if (newList.findIndex(item => item.path === path) >= 0) {
  if (newList.findIndex(item => routeEqual(item, newRoute)) >= 0) {
    // const idx = newList.findIndex(item => this.routeEqual(item, newRoute))
    // newList.splice(idx, 1, { name, path, query, meta })
    return newList
  } else {
    // find当前tab位置并在其后面添加新tab
    // const idx = newList.findIndex(item => item.path === this.$route.path)
    const idx = 1
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
