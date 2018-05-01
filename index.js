// 获取小程序指定页面的二维码 demo
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// 1.首先获取 access_token
const APPID = 'your appid';
const APPSECRET = 'your appsecret';

const app = express();

app.use(bodyParser());
app.use(cookieParser());
app.use(session({ secret: 'My Secret' }));
app.use(express.static(__dirname + '/views'));

app.set(__dirname + '/views');
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/', (req, res, next) => {
	res.render('index');
});

// 表单提交方式获取二维码图片
app.post('/qrcode', (req, res, next) => {
	let appid = req.body.appid;
	let secret = req.body.secret;
	let scene = req.body.scene;
	let page = req.body.page;
	let width = req.body.width;
	let autoColor = req.body.autoColor;
	let lineColor = req.body.lineColor;

	console.log(
		`appid=${appid}\nsecret=${secret}\nscene=${scene}\npage=${page}\nwidth=${width}\nautoColor=${autoColor}\nlineColor=${JSON.stringify(
			lineColor
		)}`
	);

	getToken()
		.then(res => {
			console.log('获取accessToken', res);
			return getQRCode(res.access_token);
		})
		.then(data => {
			if (data.errcode) {
				return res.render('<h2>出错啦<br/><p>错误信息：' + data.errmsg + '</p></h2>');
			}
			//data.pipe(fs.createWriteStream(Date.now() + '.png'));
			return data.pipe(res);
		});

	// 获取access_token
	function getToken() {
		return new Promise(function(resolve) {
			axios
				.get('https://api.weixin.qq.com/cgi-bin/token', {
					params: {
						grant_type: 'client_credential',
						appid: appid || APPID,
						secret: secret || APPSECRET
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
		let params = {};

		if (scene) params.scene = scene;
		if (page) params.page = page;
		if (width) params.width = width;
		params.auto_color = autoColor == 'on';
		if (lineColor) params.line_color = JSON.parse(lineColor);

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
});

app.listen(3000, function() {
	console.log('Server started success, Please visite http://localhost:3000');
});
