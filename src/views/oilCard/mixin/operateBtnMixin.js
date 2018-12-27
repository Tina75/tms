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
    refuel () {
      console.log('refuel')
    },
    // 转账
    transfer () {
      console.log('transfer')
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
    recover () {
      console.log('recover')
    }
  }
}
