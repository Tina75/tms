// 表格中的按钮方法
export default {
  methods: {
    // 分配
    assign (p) {
      this.openDialog({
        name: 'oilCard/dialog/assign',
        data: {
          title: '分配油卡',
          assign: {
            id: p.row.id,
            number: p.row.number,
            amount: p.row.amount,
            remark: p.row.remark
          }
        },
        methods: {
          ok () {
            this.fetchData()
          }
        }
      })
    },
    // 充值
    recharge () {
      console.log('recharge')
    },
    // 加油
    refuel (p) {
      console.log(p.row)
      this.openDialog({
        name: 'oilCard/dialog/refuel',
        data: {
          title: '油卡加油',
          refuel: {
            id: p.row.id,
            number: p.row.number,
            amount: p.row.amount,
            remark: p.row.remark,
            type: p.row.type,
            driverName: p.row.driverName,
            truckNo: p.row.truckNo,
            issuer: p.row.issuer
          }
        },
        methods: {
          ok () {
            this.fetchData()
          }
        }
      })
    },
    // 转账
    transfer (p) {
      this.openDialog({
        name: 'oilCard/dialog/transfer',
        data: {
          title: '油卡转账',
          transfer: {
            id: p.row.id,
            number: p.row.number,
            amount: p.row.amount,
            remark: p.row.remark,
            type: p.row.type,
            issuer: p.row.issuer,
            primaryCardNumber: p.row.primaryCardNumber
          }
        },
        methods: {
          ok () {
            this.fetchData()
          }
        }
      })
    },
    // 修改
    update (p) {
      this.openDialog({
        name: 'oilCard/dialog/addEdit',
        data: {
          title: '修改油卡',
          mode: 2,
          addEdit: {
            id: p.row.id,
            number: p.row.number,
            amount: p.row.amount,
            remark: p.row.remark,
            type: p.row.type,
            issuer: p.row.issuer,
            primaryCardId: p.row.primaryCardId,
            primaryCardNumber: p.row.primaryCardNumber
          }
        },
        methods: {
          ok () {
            this.fetchData()
          }
        }
      })
    },
    // 回收
    recover (p) {
      this.openDialog({
        name: 'oilCard/dialog/recover',
        data: {
          title: '回收油卡',
          recover: {
            id: p.row.id,
            number: p.row.number,
            amount: p.row.amount,
            remark: p.row.remark,
            type: p.row.type,
            issuer: p.row.issuer
          }
        },
        methods: {
          ok () {
            this.fetchData()
          }
        }
      })
    }
  }
}
