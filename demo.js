const axios = require('axios');
const fs = require('fs');

// 1.首先获取 access_token
const APPID = 'your appid';
const APPSECRET = 'your appsecret';

getToken()
	.then(res => {
		console.log('获取accessToken', res);
		return getQRCode(res.access_token);
	})
	.then(data => {
		if (data.errcode) {
			return res.render('<h2>出错啦<br/><p>错误信息：' + data.errmsg + '</p></h2>');
		}

		data.pipe(fs.createWriteStream(Date.now() + '.png'));
	});

// 获取access_token
function getToken() {
	return new Promise(function(resolve) {
		axios
			.get('https://api.weixin.qq.com/cgi-bin/token', {
				params: {
					grant_type: 'client_credential',
					appid: APPID,
					secret: APPSECRET
				}
			})
			.then(response => response.data)
			.then(function(data) {
				resolve(data);
			});
	});
}

// 获取二维码
function getQRCode(access_token) {
	const GET_WXACODE_UNLIMIT = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=`;
	let params = {
		scene: 'goodsId=1232412',
		page: 'pages/product/index',
		width: 430,
		auto_color: false,
		line_color: { r: '0', g: '0', b: '0' }
	};

	console.log(JSON.stringify(params));
	return new Promise(function(resolve, reject) {
		axios
			.post(GET_WXACODE_UNLIMIT + access_token, params, {
				responseType: 'stream'
			})
			.then(response => response.data)
			.then(function(data) {
				resolve(data);
			});
	});
}
