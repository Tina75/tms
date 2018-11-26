import server from '@/libs/js/server'
export default {
  /**
   * 查询订单详情
   * @param {*} store
   * @param {*} id
   */
  getOrderDetail (id) {
    return new Promise((resolve, reject) => {
      server({
        method: 'get',
        url: 'order/detail',
        data: {
          id
        }
      })
        .then((response) => {
          resolve(response.data.data)
        })
        .catch((err) => reject(err))
    })
  },
  // 提交表单
  submitOrder (form) {
    let url = 'order/create'
    if (form.id) {
      url = 'order/update'
    }

    return new Promise((resolve, reject) => {
      server({
        method: 'post',
        url,
        data: {
          ...form
        }
      })
        .then((response) => resolve(response))
        .catch((err) => reject(err))
    })
  },
  validPermit (data) {
    return new Promise((resolve, reject) => {
      server({
        method: 'get',
        url: 'permission/validDirectSend',
        data
      }).then(response => {
        resolve(response.data.data)
      }).catch(err => reject(err))
    })
  },
  // 立即发运
  immediShip (param) {
    return new Promise((resolve, reject) => {
      const data = Object.assign({}, param)
      server({
        method: 'post',
        url: '/order/shipImmediately',
        data
      }).then((response) => {
        resolve(response.data.data)
      }).catch(err => reject(err))
    })
  },
  // 下拉业务员
  getBusineList () {
    return new Promise((resolve, reject) => {
      const data = [
        { name: '全部', value: '全部' },
        { name: '小王', value: '小王' },
        { name: '小张', value: '小张' }
      ]
      resolve(data)
    })
  },
  // 业务员权限
  businePermit (param) {
    return new Promise((resolve, reject) => {
      const data = Object.assign({}, param.businer)
      console.log(data)
      resolve(param.form)
    })
  }
}
