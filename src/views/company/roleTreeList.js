export default {
  data1: [{
    key: 'data1',
    title: '受理开单',
    code: '100000',
    expand: true,
    disabled: true,
    checked: true,
    children: [{
      title: '手工开单',
      expand: true,
      code: '100100',
      parentId: '100000',
      disabled: true,
      checked: true,
      children: [
        { title: '页面查看', code: '100100', parentId: '100000', disabled: true },
        { title: '保存', code: '100101', parentId: '100100', grandId: '100000', disabled: true },
        { title: '打印并保存', code: '100102', parentId: '100100', grandId: '100000', disabled: true },
        { title: '清空', code: '100103', parentId: '100100', grandId: '100000', disabled: true },
        { title: '直接发运', code: '100104', parentId: '100100', grandId: '100000', disabled: true }
      ]
    },
    {
      title: '批量导入',
      expand: true,
      code: '100200',
      parentId: '100000',
      disabled: true,
      checked: true,
      children: [
        { title: '页面查看', code: '100200', parentId: '100000', disabled: true },
        { title: '导入文件', code: '100201', parentId: '100200', grandId: '100000', disabled: true },
        { title: '下载模板', code: '100202', parentId: '100200', grandId: '100000', disabled: true },
        { title: '下载（列表上）', code: '100203', parentId: '100200', grandId: '100000', disabled: true },
        { title: '查看订单', code: '100204', parentId: '100200', grandId: '100000', disabled: true },
        { title: '删除记录', code: '100205', parentId: '100200', grandId: '100000', disabled: true },
        { title: '清空记录', code: '100206', parentId: '100200', grandId: '100000', disabled: true }
      ]
    },
    {
      title: '订单管理',
      expand: true,
      code: '100300',
      parentId: '100000',
      disabled: true,
      checked: true,
      children: [
        { title: '页面查看', code: '100300', parentId: '100000', disabled: true },
        { title: '编辑订单', code: '100301', parentId: '100300', grandId: '100000', disabled: true },
        { title: '删除', code: '100302', parentId: '100300', grandId: '100000', disabled: true },
        { title: '打印', code: '100303', parentId: '100300', grandId: '100000', disabled: true },
        { title: '导出', code: '100304', parentId: '100300', grandId: '100000', disabled: true },
        { title: '恢复', code: '100305', parentId: '100300', grandId: '100000', disabled: true },
        { title: '彻底删除', code: '100306', parentId: '100300', grandId: '100000', disabled: true }
      ]
    }]
  }],
  // data2: [{
  //   key: 'data2',
  //   title: '订单管理',
  //   code: '110000',
  //   expand: true,
  //   disabled: true,
  //   checked: true,
  //   children: [{
  //     title: '订单管理',
  //     code: '110100',
  //     parentId: '110000',
  //     expand: true,
  //     disabled: true,
  //     checked: true,
  //     children: [
  //       { title: '页面查看', code: '110100', parentId: '110000', disabled: true },
  //       /**
  //      * 20181019 注释 by mys
  //      * { title: '送货调度', code: '110101', parentId: '110100', grandId: '110000', disabled: true },
  //      * { title: '提货调度', code: '110102', parentId: '110100', grandId: '110000', disabled: true },
  //      * { title: '拆单', code: '110103', parentId: '110100', grandId: '110000', disabled: true },
  //      * { title: '外转', code: '110104', parentId: '110100', grandId: '110000', disabled: true },
  //      * { title: '订单还原', code: '110105', parentId: '110100', grandId: '110000', disabled: true },
  //     */
  //       { title: '编辑', code: '110106', parentId: '110100', grandId: '110000', disabled: true },
  //       { title: '删除', code: '110107', parentId: '110100', grandId: '110000', disabled: true },
  //       { title: '打印', code: '110108', parentId: '110100', grandId: '110000', disabled: true },
  //       { title: '导出', code: '110109', parentId: '110100', grandId: '110000', disabled: true },
  //       { title: '恢复', code: '110110', parentId: '110100', grandId: '110000', disabled: true },
  //       { title: '彻底删除', code: '110111', parentId: '110100', grandId: '110000', disabled: true }
  //     ]
  //   }, {
  //     title: '回单管理',
  //     code: '110200',
  //     parentId: '110000',
  //     disabled: true,
  //     checked: true,
  //     expand: true,
  //     children: [
  //       { title: '页面查看', code: '110200', parentId: '110000', disabled: true },
  //       { title: '回收', code: '110201', parentId: '110200', grandId: '110000', disabled: true },
  //       { title: '返厂', code: '110202', parentId: '110200', grandId: '110000', disabled: true },
  //       { title: '导出', code: '110203', parentId: '110200', grandId: '110000', disabled: true },
  //       { title: '上传回单照片', code: '110204', parentId: '110200', grandId: '110000', disabled: true },
  //       { title: '修改回单照片', code: '110205', parentId: '110200', grandId: '110000', disabled: true }
  //     ]
  //   }]
  // }],
  data3: [{
    key: 'data3',
    title: '运输管理',
    code: '120000',
    expand: true,
    disabled: true,
    checked: true,
    children: [{
      title: '提货管理',
      code: '120200',
      parentId: '120000',
      expand: true,
      disabled: true,
      checked: true,
      children: [
        { title: '页面查看', code: '120200', parentId: '120000', disabled: true },
        { title: '提货调度', code: '120208', parentId: '120200', grandId: '120000', disabled: true },
        { title: '外转', code: '120209', parentId: '120200', grandId: '120000', disabled: true },
        { title: '提货', code: '120201', parentId: '120200', grandId: '120000', disabled: true },
        { title: '打印', code: '120202', parentId: '120200', grandId: '120000', disabled: true },
        { title: '到货', code: '120203', parentId: '120200', grandId: '120000', disabled: true },
        { title: '删除', code: '120204', parentId: '120200', grandId: '120000', disabled: true },
        { title: '查看车辆位置', code: '120205', parentId: '120200', grandId: '120000', disabled: true },
        { title: '编辑', code: '120206', parentId: '120200', grandId: '120000', disabled: true },
        { title: '导出', code: '120207', parentId: '120200', grandId: '120000', disabled: true },
        { title: '上报异常', code: '120210', parentId: '120100', grandId: '120000', disabled: true },
        { title: '处理', code: '120211', parentId: '120100', grandId: '120000', disabled: true },
        { title: '编辑异常', code: '120212', parentId: '120100', grandId: '120000', disabled: true }
      ]
    }, {
      title: '送货管理',
      code: '120100',
      parentId: '120000',
      expand: true,
      disabled: true,
      checked: true,
      children: [
        { title: '页面查看', code: '120100', parentId: '120000', disabled: true },
        { title: '送货调度', code: '120109', parentId: '120100', grandId: '120000', disabled: true },
        { title: '拆单', code: '120110', parentId: '120100', grandId: '120000', disabled: true },
        { title: '外转', code: '120111', parentId: '120100', grandId: '120000', disabled: true },
        { title: '订单还原', code: '120112', parentId: '120100', grandId: '120000', disabled: true },
        { title: '发运', code: '120102', parentId: '120100', grandId: '120000', disabled: true },
        { title: '派车', code: '120101', parentId: '120100', grandId: '120000', disabled: true },
        { title: '打印', code: '120103', parentId: '120100', grandId: '120000', disabled: true },
        { title: '到货', code: '120104', parentId: '120100', grandId: '120000', disabled: true },
        { title: '删除', code: '120105', parentId: '120100', grandId: '120000', disabled: true },
        { title: '查看车辆位置', code: '120106', parentId: '120100', grandId: '120000', disabled: true },
        { title: '编辑', code: '120107', parentId: '120100', grandId: '120000', disabled: true },
        { title: '导出', code: '120108', parentId: '120100', grandId: '120000', disabled: true },
        { title: '上报异常', code: '120113', parentId: '120100', grandId: '120000', disabled: true },
        { title: '处理', code: '120114', parentId: '120100', grandId: '120000', disabled: true },
        { title: '编辑异常', code: '120115', parentId: '120100', grandId: '120000', disabled: true }
      ]
    }, {
      title: '外转管理',
      code: '120300',
      parentId: '120000',
      expand: true,
      disabled: true,
      checked: true,
      children: [
        { title: '页面查看', code: '120300', parentId: '120000', disabled: true },
        { title: '发运', code: '120301', parentId: '120300', grandId: '120000', disabled: true },
        { title: '到货', code: '120302', parentId: '120300', grandId: '120000', disabled: true },
        { title: '编辑', code: '120303', parentId: '120300', grandId: '120000', disabled: true },
        { title: '删除', code: '120304', parentId: '120300', grandId: '120000', disabled: true },
        { title: '导出', code: '120305', parentId: '120300', grandId: '120000', disabled: true },
        { title: '上报异常', code: '120306', parentId: '120100', grandId: '120000', disabled: true },
        { title: '处理', code: '120307', parentId: '120100', grandId: '120000', disabled: true },
        { title: '编辑异常', code: '120308', parentId: '120100', grandId: '120000', disabled: true },
        { title: '查看车辆位置', code: '120309', parentId: '120100', grandId: '120000', disabled: true }
      ]
    }, {
      title: '异常管理',
      code: '120400',
      parentId: '120000',
      expand: true,
      disabled: true,
      checked: true,
      children: [
        { title: '页面查看', code: '120400', parentId: '120000', disabled: true },
        { title: '处理', code: '120401', parentId: '120400', grandId: '120000', disabled: true },
        { title: '编辑', code: '120402', parentId: '120400', grandId: '120000', disabled: true },
        { title: '导出', code: '120403', parentId: '120400', grandId: '120000', disabled: true }
      ]
    }, {
      title: '异常管理',
      code: '120500',
      parentId: '120000',
      expand: true,
      disabled: true,
      checked: true,
      children: [
        { title: '页面查看', code: '120500', parentId: '120000', disabled: true },
        { title: '回收', code: '120501', parentId: '120400', grandId: '120000', disabled: true },
        { title: '返厂', code: '120502', parentId: '120400', grandId: '120000', disabled: true },
        { title: '导出', code: '120503', parentId: '120400', grandId: '120000', disabled: true },
        { title: '上传回单照片', code: '120504', parentId: '120400', grandId: '120000', disabled: true },
        { title: '修改回单照片', code: '120505', parentId: '120400', grandId: '120000', disabled: true }
      ]
    }]
  }],
  data4: [{
    key: 'data4',
    title: '客户管理',
    code: '130000',
    expand: true,
    disabled: true,
    checked: true,
    children: [{
      title: '发货方管理',
      code: '130100',
      parentId: '130000',
      expand: true,
      disabled: true,
      checked: true,
      children: [
        { title: '页面查看', code: '130100', parentId: '130000', disabled: true },
        { title: '新增发货方', code: '130101', parentId: '130100', grandId: '130000', disabled: true },
        { title: '修改发货方', code: '130102', parentId: '130100', grandId: '130000', disabled: true },
        { title: '删除发货方', code: '130103', parentId: '130100', grandId: '130000', disabled: true },
        { title: '新增发货地址', code: '130104', parentId: '130100', grandId: '130000', disabled: true },
        { title: '修改发货地址', code: '130105', parentId: '130100', grandId: '130000', disabled: true },
        { title: '删除发货地址', code: '130106', parentId: '130100', grandId: '130000', disabled: true },
        { title: '新增收货方', code: '130107', parentId: '130100', grandId: '130000', disabled: true },
        { title: '修改收货方', code: '130108', parentId: '130100', grandId: '130000', disabled: true },
        { title: '删除收货方', code: '130109', parentId: '130100', grandId: '130000', disabled: true },
        { title: '新增常发货物', code: '130110', parentId: '130100', grandId: '130000', disabled: true },
        { title: '修改常发货物', code: '130111', parentId: '130100', grandId: '130000', disabled: true },
        { title: '删除常发货物', code: '130112', parentId: '130100', grandId: '130000', disabled: true },
        { title: '新增计费规则', code: '130113', parentId: '130100', grandId: '130000', disabled: true },
        { title: '修改计费规则', code: '130114', parentId: '130100', grandId: '130000', disabled: true },
        { title: '删除计费规则', code: '130115', parentId: '130100', grandId: '130000', disabled: true }
      ]
    }, {
      title: '承运商管理',
      code: '130200',
      parentId: '130000',
      expand: true,
      disabled: true,
      checked: true,
      children: [
        { title: '页面查看', code: '130200', parentId: '130000', disabled: true },
        { title: '新增承运商', code: '130201', parentId: '130200', grandId: '130000', disabled: true },
        { title: '修改承运商', code: '130202', parentId: '130200', grandId: '130000', disabled: true },
        { title: '删除承运商', code: '130203', parentId: '130200', grandId: '130000', disabled: true },
        { title: '新增车辆', code: '130207', parentId: '130200', grandId: '130000', disabled: true },
        { title: '修改车辆', code: '130208', parentId: '130200', grandId: '130000', disabled: true },
        { title: '删除车辆', code: '130209', parentId: '130200', grandId: '130000', disabled: true },
        { title: '导出车辆', code: '130210', parentId: '130200', grandId: '130000', disabled: true },
        { title: '新增维修记录', code: '130211', parentId: '130200', grandId: '130000', disabled: true },
        { title: '修改维修记录', code: '130212', parentId: '130200', grandId: '130000', disabled: true },
        { title: '删除维修记录', code: '130213', parentId: '130200', grandId: '130000', disabled: true },
        { title: '导出维修记录', code: '130214', parentId: '130200', grandId: '130000', disabled: true },
        { title: '新增计费规则', code: '130215', parentId: '130200', grandId: '130000', disabled: true },
        { title: '修改计费规则', code: '130216', parentId: '130200', grandId: '130000', disabled: true },
        { title: '删除计费规则', code: '130217', parentId: '130200', grandId: '130000', disabled: true }
      ]
    }, {
      title: '外转方管理',
      expand: true,
      disabled: true,
      checked: true,
      code: '130300',
      parentId: '130000',
      children: [
        { title: '页面查看', code: '130300', parentId: '130000', disabled: true },
        { title: '新增外转方', code: '130301', parentId: '130300', grandId: '130000', disabled: true },
        { title: '修改外转方', code: '130302', parentId: '130300', grandId: '130000', disabled: true },
        { title: '删除外转方', code: '130303', parentId: '130300', grandId: '130000', disabled: true }
      ]
    }]
  }],
  data5: [{
    key: 'data5',
    title: '公司管理',
    expand: true,
    disabled: true,
    checked: true,
    code: '140000',
    children: [{
      title: '角色管理',
      expand: true,
      disabled: true,
      checked: true,
      code: '140100',
      parentId: '140000',
      children: [
        { title: '页面查看', code: '140100', parentId: '140000', disabled: true },
        { title: '添加角色', code: '140101', parentId: '140100', grandId: '140000', disabled: true },
        { title: '更改角色', code: '140102', parentId: '140100', grandId: '140000', disabled: true },
        { title: '删除角色', code: '140103', parentId: '140100', grandId: '140000', disabled: true }
      ]
    }, {
      title: '员工管理',
      expand: true,
      disabled: true,
      checked: true,
      code: '140200',
      parentId: '140000',
      children: [
        { title: '页面查看', code: '140200', parentId: '140000', disabled: true },
        { title: '添加员工', code: '140201', parentId: '140200', grandId: '140000', disabled: true },
        { title: '修改员工', code: '140202', parentId: '140200', grandId: '140000', disabled: true },
        { title: '删除员工', code: '140203', parentId: '140200', grandId: '140000', disabled: true }
      ]
    }]
  }],
  data8: [{
    key: 'data8',
    title: '财务管理',
    expand: true,
    disabled: true,
    checked: true,
    code: '170000',
    children: [{
      title: '发货方对账',
      expand: true,
      disabled: true,
      checked: true,
      code: '170100',
      parentId: '170000',
      children: [
        { title: '页面查看', code: '170100', parentId: '170000', disabled: true },
        { title: '按单核销', code: '170101', parentId: '170100', grandId: '170000', disabled: true },
        { title: '生成对账单', code: '170102', parentId: '170100', grandId: '170000', disabled: true },
        { title: '对账单核销', code: '170103', parentId: '170100', grandId: '170000', disabled: true },
        { title: '对账单导出', code: '170104', parentId: '170100', grandId: '170000', disabled: true },
        { title: '查看核销单详情', code: '170105', parentId: '170100', grandId: '170000', disabled: true },
        { title: '核销单导出', code: '170106', parentId: '170100', grandId: '170000', disabled: true }
      ]
    }, {
      title: '承运商对账',
      expand: true,
      disabled: true,
      checked: true,
      code: '170200',
      parentId: '170000',
      children: [
        { title: '页面查看', code: '170200', parentId: '170000', disabled: true },
        { title: '按单核销', code: '170201', parentId: '170200', grandId: '170000', disabled: true },
        { title: '生成对账单', code: '170202', parentId: '170200', grandId: '170000', disabled: true },
        { title: '对账单核销', code: '170203', parentId: '170200', grandId: '170000', disabled: true },
        { title: '对账单导出', code: '170204', parentId: '170200', grandId: '170000', disabled: true },
        { title: '查看核销单详情', code: '170205', parentId: '170200', grandId: '170000', disabled: true },
        { title: '核销单导出', code: '170206', parentId: '170200', grandId: '170000', disabled: true }
      ]
    }, {
      title: '外转方对账',
      expand: true,
      disabled: true,
      checked: true,
      code: '170300',
      parentId: '170000',
      children: [
        { title: '页面查看', code: '170300', parentId: '170000', disabled: true },
        { title: '按单核销', code: '170301', parentId: '170300', grandId: '170000', disabled: true },
        { title: '生成对账单', code: '170302', parentId: '170300', grandId: '170000', disabled: true },
        { title: '对账单核销', code: '170303', parentId: '170300', grandId: '170000', disabled: true },
        { title: '对账单导出', code: '170304', parentId: '170300', grandId: '170000', disabled: true },
        { title: '查看核销单详情', code: '170305', parentId: '170300', grandId: '170000', disabled: true },
        { title: '核销单导出', code: '170306', parentId: '170300', grandId: '170000', disabled: true }
      ]
    }, {
      title: '计费规则',
      expand: true,
      disabled: true,
      checked: true,
      code: '170400',
      parentId: '170000',
      children: [
        { title: '页面查看', code: '170400', parentId: '170000', disabled: true },
        { title: '新增', code: '170401', parentId: '170400', grandId: '170000', disabled: true },
        { title: '编辑', code: '170402', parentId: '170400', grandId: '170000', disabled: true },
        { title: '删除', code: '170403', parentId: '170400', grandId: '170000', disabled: true }
      ]
    }, {
      title: '代收货款对账',
      expand: true,
      disabled: true,
      checked: true,
      code: '170500',
      parentId: '170000',
      children: [
        { title: '页面查看', code: '170500', parentId: '170000', disabled: true },
        { title: '收款核销', code: '170501', parentId: '170500', grandId: '170000', disabled: true },
        { title: '付款核销', code: '170502', parentId: '170500', grandId: '170000', disabled: true },
        { title: '查看', code: '170503', parentId: '170500', grandId: '170000', disabled: true },
        { title: '导出', code: '170504', parentId: '170500', grandId: '170000', disabled: true }
      ]
    }, {
      title: '返现对账',
      expand: true,
      disabled: true,
      checked: true,
      code: '170600',
      parentId: '170000',
      children: [
        { title: '页面查看', code: '170600', parentId: '170000', disabled: true },
        { title: '核销', code: '170601', parentId: '170600', grandId: '170000', disabled: true },
        { title: '查看', code: '170602', parentId: '170600', grandId: '170000', disabled: true },
        { title: '导出', code: '170603', parentId: '170600', grandId: '170000', disabled: true }
      ]
    }]
  }],
  data9: [{
    key: 'data9',
    title: '报表',
    expand: true,
    disabled: true,
    checked: true,
    code: '180000',
    children: [
      { title: '运营报表', code: '180100', parentId: '180000', disabled: true },
      { title: '营业额汇总表', code: '180200', parentId: '180000', disabled: true },
      { title: '利润报表', code: '180300', parentId: '180000', disabled: true }
    ]
  }],
  data6: [{
    key: 'data6',
    title: '设置',
    expand: true,
    disabled: true,
    checked: true,
    code: '150000',
    children: [
      { title: '公司设置', code: '150100', parentId: '150000', disabled: true },
      { title: '短信设置', code: '150200', parentId: '150000', disabled: true }
    ]
  }]
}
