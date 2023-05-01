const express = require('express')
//导入 moment
const moment = require('moment')
const AccountModel = require('../../models/AccountModel')
const router = express.Router()

// 声明中间件
let checkTokenMiddleware = require('../../middlewares/checkTokenMiddleware')

//记账本的列表
router.get('/account', checkTokenMiddleware, function (req, res, next) {
    console.log(req.user)
    //读取集合信息
    AccountModel.find()
        .sort({ time: -1 })
        .then(data => {
            //响应成功的提示
            res.json({
                // 响应编号
                code: '0000',
                // 响应的消息
                msg: '读取成功',
                // 响应的数据
                data: data,
            })
        }).catch(err => {
            res.json({
                // 响应编号
                code: '1001',
                // 响应的消息
                msg: '读取失败',
                // 响应的数据
                data: null,
            })
            return
        })
})

//新增记录
router.post('/account', checkTokenMiddleware, (req, res) => {
    // 表单验证

    //插入数据库
    AccountModel.create({
        ...req.body,
        //修改 time 属性的值
        time: moment(req.body.time).toDate()
    }).then(data => {
        res.json({
            code: '0000',
            msg: '创建成功',
            data: data,
        })
    }).catch(err => {
        res.json({
            code: '1002',
            msg: '创建失败',
            data: null,
        })
        return
    })
})

//删除记录
router.delete('/account/:id', checkTokenMiddleware, (req, res) => {
    //获取 params 的 id 参数
    let id = req.params.id
    //删除
    AccountModel.deleteOne({ _id: id })
        .then(data => {
            res.json({
                code: '0000',
                msg: '删除成功',
                data: data,
            })
        }).catch(err => {
            res.json({
                code: '1003',
                msg: '删除账单失败',
                data: null,
            })
            return
        })
})

// 获取单个账单信息
router.get('/account/:id', checkTokenMiddleware, (req, res) => {
    //获取 params 的 id 参数
    let { id } = req.params
    AccountModel.findById(id)
        .then(data => {
            res.json({
                code: '0000',
                msg: '读取成功',
                data: data,
            })
        }).catch(err => {
            res.json({
                code: '1004',
                msg: '读取失败',
                data: null,
            })
            return
        })
})

// 更新单个账单信息
router.patch('/account/:id', checkTokenMiddleware, (req, res) => {
    //获取 params 的 id 参数
    let { id } = req.params
    // 更新数据库
    AccountModel.updateOne({ _id: id }, req.body)
        .then(data => {
            // 再次查询数据库 获取单条数据
            AccountModel.findById(id)
                .then(data => {
                    res.json({
                        code: '0000',
                        msg: '更新成功',
                        data: data,
                    })
                }).catch(err => {
                    res.json({
                        code: '1004',
                        msg: '读取失败',
                        data: null,
                    })
                    return
                })
        }).catch(err => {
            res.json({
                code: '1005',
                msg: '更新失败',
                data: null,
            })
            return
        })
})

module.exports = router
