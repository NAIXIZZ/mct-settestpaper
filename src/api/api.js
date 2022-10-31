import { request } from "./request";

export function Read4(context,medical_num,synthesis_num){
    return request({
        url: '/mct_read4?context='+context+'&medical_num='+medical_num+'&synthesis_num='+synthesis_num,
        method: 'post',
        // headers:{
        //     // "Content-Type": "application/x-www-form-urlencoded"
        //     "Access-Control-Allow-Origin":"*"
        // }
    })
}