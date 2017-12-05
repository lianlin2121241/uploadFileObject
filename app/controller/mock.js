const Mock = require('mockjs')

/**
 * 根据mock模板生成数据
 * 通过post请求
 * contentType类型为application/json
 * 因为结构复杂最好使用此contentType类型
 */
module.exports.getMockData = function (req, res) {
    try{
        let body=req.body
        let mockParams = body.mockParams
        if(!mockParams){
            res.json({
                success:false,
                msg:"没有包含mockParams参数",
                data:""
            })
        }
        let mockData = Mock.mock(mockParams)
        res.json({
            success:true,
            msg:"",
            data:mockData
        })
    }catch(e){
        res.json({
            success:false,
            msg:e.message,
            data:""
        })
    }
}