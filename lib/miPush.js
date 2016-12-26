'use strict';
/**
 * Created by gogoout on 16/12/21.
 */
var request = require('request');
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
	return data;
};

MiPush.prototype.send = function (url, data, callback) {
	request.post(
		{
			url    : url,
			headers: {Authorization: `key=${this.options.appSecret}`},
			form   : data
		},
		utils.resHandler(callback)
	);
};

MiPush.prototype.sendToRegIds = function (regIds, data, callback) {
	if (!regIds) {
		return callback(new Error('regId不能为空'));
	}
	try {
		this.prepareCommon(data);
	}
	catch (e) {
		return callback(e);
	}

	if (Array.isArray(regIds)) {
		regIds = regIds.join(',');
	}
	data['registration_id'] = regIds;

	this.send(constants.URL_HOST + constants.URL_REGID, data, callback);
};

MiPush.prototype.sendToAlias = function (alias, data, callback) {
	if (!alias) {
		return callback(new Error('alias不能为空'));
	}
	try {
		this.prepareCommon(data);
	}
	catch (e) {
		return callback(e);
	}

	if (Array.isArray(alias)) {
		alias = alias.join(',');
	}
	data.alias = alias;
	this.send(constants.URL_HOST + constants.URL_ALIAS, data, callback);
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

	data.topic = topic;
	this.send(constants.URL_HOST + constants.URL_TOPIC, data, callback);
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

	try {
		this.prepareCommon(data);
	}
	catch (e) {
		return callback(e);
	}

	topics = topics.join(';$;');
	data.topics = topics;
	data['topic_op'] = topicsOperation;

	this.send(constants.URL_HOST + constants.URL_MULTITOPIC, data, callback);
};

MiPush.prototype.sendToAll = function (data, callback) {
	try {
		this.prepareCommon(data);
	}
	catch (e) {
		return callback(e);
	}

	this.send(constants.URL_HOST + constants.URL_ALL, data, callback);
};

MiPush.prototype.traceMessage = function (msgId, callback) {
	if (!msgId) {
		return callback(new Error('msgId不能为空'));
	}
	request(
		{
			url    : `${constants.URL_HOST}${constants.URL_TRACE_MESSAGE}?msg_id=${msgId}`,
			headers: {Authorization: `key=${this.options.appSecret}`}
		},
		utils.resHandler(callback)
	);
};

MiPush.prototype.traceMessageByJob = function (jobKey, callback) {
	if (!jobKey) {
		return callback(new Error('jobKey不能为空'));
	}
	request(
		{
			url    : `${constants.URL_HOST}${constants.URL_TRACE_MESSAGE}?job_key=${jobKey}`,
			headers: {Authorization: `key=${this.options.appSecret}`}
		},
		utils.resHandler(callback)
	);
};

MiPush.prototype.traceMessages = function (beginTime, endTime, callback) {
	if (!beginTime || !endTime) {
		return callback(new Error('beginTime和endTime参数不能为空'));
	}
	request(
		{
			url    : `${constants.URL_HOST}${constants.URL_TRACE_MESSAGES}?begin_time=${beginTime}&end_time=${endTime}`,
			headers: {Authorization: `key=${this.options.appSecret}`}
		},
		utils.resHandler(callback)
	);
};


MiPush.prototype.counters = function (packageName, startTime, endTime, callback) {
	if (!packageName) {
		return callback(new Error('restrictedPackageName参数不能为空'));
	}
	if (!startTime || !endTime) {
		return callback(new Error('startTime和endTime参数不能为空'));
	}
	request(
		{
			url    : `${constants.URL_HOST}${constants.URL_TRACE_MESSAGES}?restricted_package_name=${packageName}&start_time=${startTime}&end_time=${endTime}`,
			headers: {Authorization: `key=${this.options.appSecret}`}
		},
		utils.resHandler(callback)
	);
};
module.exports = MiPush;

