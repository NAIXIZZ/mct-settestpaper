import { request } from "./request";

export function Read1(data,c,n){
    return request({
        url: 'http://81.69.21.224:9012/MCT_read1?data='+data+'&c='+c+'&n='+n,
        method: 'post',
        // headers:{
        //     // "Content-Type": "application/x-www-form-urlencoded"
        //     "Access-Control-Allow-Origin":"*"
        // }
    })
}

export function Read4(context,medical_num,synthesis_num,quest_level){
    return request({
        url: 'http://81.69.21.224:9011/mct_read4?context='+context+'&medical_num='+medical_num+'&synthesis_num='+synthesis_num+'&quest_level='+quest_level,
        method: 'post',
        // headers:{
        //     // "Content-Type": "application/x-www-form-urlencoded",
        //     "Access-Control-Allow-Origin":"*"
        // }
    })
}

export function Illegal(type,question_content,question,options,answer,MCTlevel,check_type){
    return request({
        url: 'http://81.69.21.224:9910/mct_check?type='+type+'&question_content='+question_content+'&question='+question+'&options='+options+'&answer='+answer+'&MCTlevel='+MCTlevel+'&check_type='+check_type,
        method: 'post',
    })
}