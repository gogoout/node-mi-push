'use strict';
/**
 * Created by gogoout on 16/12/21.
 */
var mapKeys = require('lodash/mapKeys'),
	snakeCase = require('lodash/snakeCase'),
	forOwn = require('lodash/forOwn');


function throwIfisNull(value, errorMessage) {
	if (value == null) {
		throw new Error(errorMessage);
	}
}

function dataTransformer(data) {
	throwIfisNull(data.payload, 'payload不能为空!');
	throwIfisNull(data.restrictedPackageName, 'restrictedPackageName不能为空!');
	throwIfisNull(data.title, 'title不能为空');
	throwIfisNull(data.description, 'description不能为空');
	throwIfisNull(data.passThrough, 'passThrough不能为空');
	throwIfisNull(data.notifyType, 'notifyType不能为空');

	data = mapKeys(data, function (value, key) {
		return snakeCase(key);
	});
	if (data.extra) {
		forOwn(data.extra, function (value, key) {
			data[`extra.${snakeCase(key)}`] = value;
		});
		delete data.extra;
	}
	return data;
}

function resHandler(callback) {
	return function (err, res, body) {
		if (err) {
			return callback(err);
		}

		if (res.statusCode < 200 || res.statusCode >= 400) {
			let resError = new Error(res.statusCode + ' ' + res.statusMessage);
			return callback(resError);
		}
		var json;
		try {
			json = JSON.parse(body);
		}
		catch (e) {
			return callback(e);
		}
		if (json.result === 'error') {
			let resError = new Error(json.code + ' ' + json.reason);
			resError.message = json.description;
			return callback(resError);
		}
		else {
			return callback(null, json);
		}
	}
}

module.exports = {
	throwIfisNull,
	dataTransformer,
	resHandler
};