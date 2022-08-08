import Qs from 'qs'
const axios = require('axios');
function nodeVoice (word) {
    // const API_KEY = 'LxAuLVLVtjj2O19GU4AGRMSW'
    // const SECRET_KEY = 'sewNe9yUFQI0UiqyahfRGqM7kFzidlGu'
    var token = '25.7bac3f9059764675db94ecfac1a25c3f.315360000.1968078054.282335-26229272'
    // var tokenUrl = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + API_KEY + '&client_secret=' + SECRET_KEY
    // const param = Qs.stringify({
    //     'grant_type': 'client_credentials',
    //     'client_id': API_KEY,
    //     'client_secret': SECRET_KEY
    // });
    // axios.get(tokenUrl)
    //     .then(function (response) {
    //         console.log(response);
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
    // var postUrl = 'http://tsn.baidu.com/text2audio?grant_type=client_credentials&client_id=' + API_KEY + '&client_secret=' + SECRET_KEY + '&'
    var postUrl = 'http://tsn.baidu.com/text2audio'
    var tex = encodeURI(word)
    tex = encodeURI(tex)
    axios.post(postUrl, Qs.stringify({
        tex: tex,
        tok: token,
        cuid: '40-74-E0-E0-B1-36',
        ctp: 1,
        lan: 'zh',
    }))
        .then(function (response) {
            console.log(response);
            new Audio(response).play()
        })
        .catch(function (error) {
            console.log(error);
        });
}
export { nodeVoice }