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
		data.extra = mapKeys(data.extra, function (value, key) {
			return snakeCase(key);
		});
	}
	return data;
}

function jsonToForm(json, form, keyPrefix) {
	keyPrefix = keyPrefix || '';
	forOwn(json, function (value, key) {
		if (key != null && value != null) {
			if (key !== 'extra') {
				form.append(keyPrefix + key, value);
			}
			else {
				jsonToForm(value, form, 'extra.')
			}
		}
	});
	return form;
}

function resErrorHandler(callback) {
	return function (err, res) {
		if (err) {
			return callback(err);
		}
		if (res.statusCode < 200 || res.statusCode >= 400) {
			var resError = new Error(res.statusCode + ' ' + res.statusMessage);
			resError.response = res;
			return callback(resError);
		}
		return callback(null, res);
	}
}

module.exports = {
	throwIfisNull,
	dataTransformer,
	jsonToForm,
	resErrorHandler
};