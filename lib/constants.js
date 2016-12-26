'use strict';
/**
 * Created by gogoout on 16/12/21.
 */
module.exports = {
	URL_HOST          : 'https://api.xmpush.xiaomi.com',
	URL_REGID         : '/v3/message/regid',
	URL_ALIAS         : '/v3/message/alias',
	URL_TOPIC         : '/v3/message/topic',
	URL_MULTITOPIC    : '/v3/message/multi_topic',
	URL_ALL           : '/v3/message/all',
	URL_TRACE_MESSAGE : '/v1/trace/message/status',
	URL_TRACE_MESSAGES: '/v1/trace/messages/status',
	URL_COUNTERS      : '/v1/stats/message/counters',

	NOTIFY_TYPE_ALL    : -1,
	NOTIFY_TYPE_SOUND  : 1,
	NOTIFY_TYPE_VIBRATE: 2,
	NOTIFY_TYPE_LIGHTS : 4,

	TOPICS_OP_UNION       : 'UNION',
	TOPICS_OP_INTERSECTION: 'INTERSECTION',
	TOPICS_OP_EXCEPT      : 'EXCEPT'
};