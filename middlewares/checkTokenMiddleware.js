const jwt = require('jsonwebtoken')
const { secret } = require('../config/config')

module.exports = (req, res, next) => {
    // 获取 token
    let token = req.get('token')
    if (!token) {
        return res.json({
            code: '2003',
            msg: 'token 缺失',
            data: null
        })
    }
    // 校验 token
    jwt.verify(token, secret, (err, data) => {
        // 检测token是否正确
        if (err) {
            return res.json({
                code: '2004',
                msg: 'token 不正确',
                data: null
            })
        }
        // 保存用户的信息
        req.user = data
        // 如果 token 校验成功
        next()
    })
}