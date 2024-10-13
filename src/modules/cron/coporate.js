const cron = require('node-cron');
const openApi = require('../open-api/request');
const { Coporate } = require('../../database/schema/coporateSchema');


const update = async() => {
    let result = await openApi.getCorporateCode().then(res => res.data.map(e => {
        return {
            code: e.codeId,
            name: e.codeName
        }
    }));
    console.log(result)
    await Coporate.create(result);
}


const scheduleUpdate = () => {
    cron.schedule('0 9 * * 1', () => update(), {
      timezone: "Asia/Seoul"  // 한국 시간대 설정
    });
    console.log("updated coporate code");
}

module.exports = {
    update,
    scheduleUpdate
}