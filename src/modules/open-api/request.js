const axios = require('axios');
require('dotenv').config();

axios.defaults.baseURL = process.env.API_URL;
axios.defaults.params = {
    serviceKey : process.env.API_KEY,
    apiType : 'json'
};

const getMarketCode = async () => {
    const response = await axios.get('/code/whsal.do');
    return response.data;
};


const getProductCode = async(pageNo) => {
    const response = await axios.get('/code/good.do', {
        params: {
            pageNo
        }
    })
    
    return response.data;
}

const getWholesaleMarketRealTime = async(pageNo, whsalCd, large, mid, small) => {
    const response = await axios.get('/price/real.do', {
        params: {
            pageNo,
            whsalCd,
            largeCd: large,
            midCd: mid,
            smallCd: small
        }
    })

    return response.data;
}

const getCorporateCode = async() => {
    const response = await axios('/code/cmp.do');
    return response.data;
}





module.exports = {
    getMarketCode,
    getProductCode,
    getCorporateCode,
    getWholesaleMarketRealTime
};
