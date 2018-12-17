/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, permissions) => {
  let res = []
  forEach(list, item => {
    if (item.meta && !item.meta.hideInMenu) {
      // 拥有二级菜单的菜单项
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if (hasChild(item) && showThisMenuEle(item, permissions)) {
        obj.children = getMenuByRouter(item.children, permissions)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      if (showThisMenuEle(item, permissions)) res.push(obj)
    } else if (!item.meta && hasChild(item)) {
      // 只有一级菜单
      let child = item.children.find((item) => item.meta && !item.meta.hideInMenu)
      if (child && showThisMenuEle(child, permissions)) {
        res.push({
          icon: child.meta.icon,
          name: child.name,
          meta: child.meta
        })
      }
    }
    // if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
    //   let obj = {
    //     icon: (item.meta && item.meta.icon) || '',
    //     name: item.name,
    //     meta: item.meta
    //   }
    //   if (hasChild(item) && showThisMenuEle(item, permissions)) {
    //     obj.children = getMenuByRouter(item.children, permissions)
    //   }
    //   if (item.meta && item.meta.href) obj.href = item.meta.href
    //   if (showThisMenuEle(item, permissions)) res.push(obj)
    // }
  })
  return res
}

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}
const showThisMenuEle = (item, permissions) => {
  // if (item.meta && item.meta.powerCode && item.meta.powerCode.length) {
  if (item.meta && item.meta.powerCode) {
    const code = item.meta.powerCode + ''
    return permissions.indexOf(code) > -1
  } else return true
}
// tools
export const forEach = (arr, fn) => {
  if (!arr.length || !fn) return
  let i = -1
  let len = arr.length
  while (++i < len) {
    let item = arr[i]
    fn(item, i, arr)
  }
}
