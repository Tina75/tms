// 外转方信息
export const transferees = (state) => state.transferees.map((user) => ({ name: user.name, value: user.name, id: user.id, payType: user.payType }))
