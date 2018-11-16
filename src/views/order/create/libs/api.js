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
  // 立即发运
  immediShip (id) {
    return new Promise((resolve, reject) => {
      server({
        method: 'post',
        url: '/waybill/check/order',
        data: {
          waybillIds: [id]
        }
      }).then((response) => {
        resolve(response.data.data)
      }).catch(err => reject(err))
    })
  }
}
