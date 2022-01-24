import React from 'react';
import axios from 'axios';
import config from '../config/config'

const getShopInfo = (shop) => {
    axios.get(config.rootLink + 'api/Value/GetShop?shop=' + shop)
        .then(function (response) {
            // handle success
            console.log(response);
            return response;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            return null;
        })
}
export default getShopInfo;