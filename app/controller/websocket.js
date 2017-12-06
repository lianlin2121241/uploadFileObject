const WebsocketServer = require('ws').Server
const Config = require('../../config')

let wss = new WebsocketServer({port:Config.webSocketPoint})

// ws连接事件
wss.on('connection', function (ws) {
    // 是否为查询状态
    let isSearching = false;
    // ws实例
    let wsInstance = null;
    // 停止发送请求
    let stopEvent = false;
    
    wsInstance=ws;
    ws.on('message', async function (message) {
        var stockRequest = JSON.parse(message);//根据请求过来的数据来更新。
        console.log("收到消息", stockRequest);
        if(stockRequest['eventType']==="start"&&!isSearching){
            isSearching=true;
            let result = await startSendMessage();
            if(result){
                isSearching=false;
                wsInstance.readyState==1 && wsInstance.send(JSON.stringify({
                    searchState:1,
                    msg:"查询全部数据成功"
                }));
            }else{
                isSearching=false;
                wsInstance.readyState==1 && wsInstance.send(JSON.stringify({
                    searchState:-1,
                    msg:"停止查询数据"
                }));
            }
        }else if(stockRequest['eventType']==="stop"&&isSearching){
            stopEvent=true;
        }
    });

    /**
     * 发送结果
     * @param {object} 发送的结果
     */
    function sendResult(obj){
        let timeStep=randomInterval(1000,4000);
        return new Promise(resolve => {
            setTimeout(() => {
                obj['result'] = getResult();
                wsInstance.readyState==1 && wsInstance.send(JSON.stringify(obj));
                resolve("OK");
            }, timeStep);
        });
    }
    
    /**
     * 发送消息
     */
    async function startSendMessage(){
        let state = 'bukong';
        for(let i=0,leni=PROVINCE_ARRAY.length;i<leni;i++){
            for(let j=0,lenj=RESOURCE_ARRAY.length;j<lenj;j++){
                if(stopEvent){
                    stopEvent=false;
                    return false;
                }
                var obj={
                    searchState:0,
                    province:PROVINCE_ARRAY[i],
                    resource:RESOURCE_ARRAY[j],
                    state:state,
                    result:-1
                }
                wsInstance.readyState==1 && wsInstance.send(JSON.stringify(obj));
                await sendResult(obj);
            }
            if(state==='bukong'){
                i--;
                state='chekong'
            }else{
                state='bukong'
            }
        }
        return true
    }
})

// 资源数组
const RESOURCE_ARRAY = ['MED','MEM','MEE','CMD','SMS'];
// 省份数组
const PROVINCE_ARRAY = ['110000','120000','130000','140000','150000'];

/**
 * 获取指定数值之间的随机数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number} 指定数值之间的随机数
 */
function randomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


/**
 * 获取发送的结果
 */
function getResult(){
    return Math.round(Math.random());
}
