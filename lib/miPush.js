'use strict';
/**
 * Created by gogoout on 16/12/21.
 */
var FormData = require('form-data');
var constants = require('./constants'),
	utils = require('./utils');

var _defaultOptions = {
	defaults: {
		passThrough: 0,
		notifyType : constants.NOTIFY_TYPE_ALL
	}
};

function MiPush(options) {
	var defaults = Object.assign({}, _defaultOptions.defaults, options.defaults);
	this.options = Object.assign({}, _defaultOptions, options, {defaults: defaults});
}

MiPush.prototype.prepareCommon = function (data) {
	if (!this.options.appSecret) {
		throw Error('请指定用于身份验证的APP_SECRET');
	}
	data = utils.dataTransformer(Object.assign({}, this.options.defaults, data));

	var form = new FormData();
	utils.jsonToForm(data, form);
	return form;
};

MiPush.prototype.sendToRegIds = function (regIds, data, callback) {
	if (!regIds) {
		return callback(new Error('regId不能为空'));
	}
	var form;
	try {
		form = this.prepareCommon(data);
	}
	catch (e) {
		return callback(e);
	}

	if (Array.isArray(regIds)) {
		regIds = regIds.join(',');
	}
	form.append('registration_id', regIds);

	form.submit({
		protocol: constants.URL_PROTOCOL,
		host    : constants.URL_HOST,
		path    : constants.URL_REGID,
		headers : {Authorization: `key=${this.options.appSecret}`}
	}, utils.resErrorHandler(callback))
};

MiPush.prototype.sendToAlias = function (alias, data, callback) {
	if (!alias) {
		return callback(new Error('alias不能为空'));
	}
	var form;
	try {
		form = this.prepareCommon(data);
	}
	catch (e) {
		return callback(e);
	}

	if (Array.isArray(alias)) {
		alias = alias.join(',');
	}
	form.append('alias', alias);
	form.submit({
		protocol: constants.URL_PROTOCOL,
		host    : constants.URL_HOST,
		path    : constants.URL_ALIAS,
		headers : {Authorization: `key=${this.options.appSecret}`}
	}, utils.resErrorHandler(callback))
};

MiPush.prototype.sendToTopic = function (topic, data, callback) {
	if (!topic) {
		return callback(new Error('topic不能为空'));
	}
	var form;
	try {
		form = this.prepareCommon(data);
	}
	catch (e) {
		return callback(e);
	}

	form.append('topic', topic);
	form.submit({
		protocol: constants.URL_PROTOCOL,
		host    : constants.URL_HOST,
		path    : constants.URL_TOPIC,
		headers : {Authorization: `key=${this.options.appSecret}`}
	}, utils.resErrorHandler(callback))
};

MiPush.prototype.sendToTopics = function (topics, topicsOperation, data, callback) {
	if (!topics) {
		return callback(new Error('topics不能为空'));
	}
	if (!Array.isArray(topics)) {
		return callback(new Error('topics必须为Array类型'));
	}
	if (!topicsOperation) {
		return callback(new Error('topicsOperation不能为空'));
	}
	if (topicsOperation !== constants.TOPICS_OP_UNION && topicsOperation !== constants.TOPICS_OP_INTERSECTION && topicsOperation !== constants.TOPICS_OP_EXCEPT) {
		return callback(new Error(`topicsOperation只能为"UNION","INTERSECTION","EXCEPT"3种, 传入的值为${topicsOperation}`));
	}

	var form;
	try {
		form = this.prepareCommon(data);
	}
	catch (e) {
		return callback(e);
	}

	topics = topics.join(';$;');
	form.append('topics', topics);
	form.append('topic_op', topicsOperation);
	form.submit({
		protocol: constants.URL_PROTOCOL,
		host    : constants.URL_HOST,
		path    : constants.URL_MULTITOPIC,
		headers : {Authorization: `key=${this.options.appSecret}`}
	}, utils.resErrorHandler(callback))
};

MiPush.prototype.sendToAll = function (data, callback) {
	var form;
	try {
		form = this.prepareCommon(data);
	}
	catch (e) {
		return callback(e);
	}

	form.submit({
		protocol: constants.URL_PROTOCOL,
		host    : constants.URL_HOST,
		path    : constants.URL_ALL,
		headers : {Authorization: `key=${this.options.appSecret}`}
	}, utils.resErrorHandler(callback))
};

module.exports = MiPush;

