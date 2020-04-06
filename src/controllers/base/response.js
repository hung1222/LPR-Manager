/**
 * Module:    Return typical response for API request
 * Author:    Tinasoft.vn
 * @version:  v3.0.0
 * Create:    9/2019      by @Harian
 * Modified:  dd/mm/yyyy  by @
 *
 */



const internals = {};
const debug = require('debug')('debug:response');

/**
 * Some cases of response
 * @example variable
 *          var str = '{ "name": "John Doe", "age": 42 }';
 *          var objectData = JSON.parse(str);
 *          var msg1 =    "Username or password does not matches user.";
 *          var msg2 =    "taiga.base.exceptions.WrongArguments";
 * @example 1xx 2xx
 *          response.created(res, objectData);
 * @example 3xx
 *          response.notModified(res);
 * @example 4xx
 *          response.badRequest(res, msg1, msg2);
 * @example 5xx: objectData->ignore msg
 *          response.badRequest(res, msg1, objectData);
 * @example 5xx: no objectData
 *          response.badRequest(res, msg1);
 */
module.exports = internals.Response = class extends Error {
    /* Most uses */
    // 1xx Informational response

    //200// 2xx Success
    static ok(res, objectData) {
        return new internals.Response(res, null, { statusCode: 200, objectData, ctor: internals.Response.ok });
    }
    //201
    static created(res, objectData) {
        return new internals.Response(res, null, { statusCode: 201, objectData, ctor: internals.Response.created }) ;
    }
    //202
    static accepted(res, objectData) {
        return new internals.Response(res, null, { statusCode: 202, objectData, ctor: internals.Response.accepted });
    }
    //204
    static noContent(res) {
        return new internals.Response(res, null, { statusCode: 204, ctor: internals.Response.noContent });
    }

    //304// 3xx Redirection
    static notModified(res) {
        return new internals.Response(res, null, { statusCode: 304, ctor: internals.Response.notModified });
    }

    //400// 4xx Client Errors
    static badRequest(res, _error_message, _error_type) {
        return new internals.Response(res, {_error_message: _error_message, _error_type: _error_type}, { statusCode: 400, ctor: internals.Response.badRequest });
    }
    //401
    static unauthorized (res, _error_message, _error_type) {
        return new internals.Response(res, {_error_message: _error_message, _error_type: _error_type}, { statusCode: 401, ctor: internals.Response.unauthorized  });
    }
    //403
    static forbidden(res, _error_message, _error_type) {
        return new internals.Response(res, {_error_message: _error_message, _error_type: _error_type}, { statusCode: 403, ctor: internals.Response.forbidden });
    }
    //404
    static notFound(res, _error_message, _error_type) {
        return new internals.Response(res, {_error_message: _error_message, _error_type: _error_type}, { statusCode: 404, ctor: internals.Response.notFound });
    }
    //422
    static unprocessableEntity (res, objectData) {
        return new internals.Response(res, null, { statusCode: 422, objectData, ctor: internals.Response.unprocessableEntity });
    }
    //422
    static badData(res, _error_message, _error_type) {
        return new internals.Response(res, {_error_message: _error_message, _error_type: _error_type}, { statusCode: 422, ctor: internals.Response.badData });
    }

    //500// 5xx Server Errors
    static internal(res, _error_message, _error_type, objectData, statusCode = 500) {
        log.error( _error_message );
        return new internals.Response(res, {_error_message: _error_message, _error_type: _error_type}, { statusCode: statusCode, objectData, ctor: internals.Response.internal });
    }

    // Main
    static [Symbol.hasInstance](instance) {
        return internals.Response.isError(instance);
    }

    // response return Error
    static error(responseFunction, _error_message, _error_type){
        let error = new Error(_error_message.message || _error_message);
        error.function = responseFunction;
        error.code = _error_type;
        return error;
    }

    constructor(res, message, options = {}) {
        const { statusCode = 500, objectData = null, ctor = internals.Response } = options;


        if (message && message._error_message && message._error_message.message){
            if(statusCode >= 500)
                log.error( message._error_message );
            message._error_message = message._error_message.message;
        }
        let body = objectData;
        if (!objectData)
            body = message;

        res.status(statusCode);
        // log
        if(statusCode >= 300){
            let logBody = {
                originalUrl: res.connection.parser.incoming.originalUrl || null,
                statusCode: statusCode,
                body: body
            };
            if(statusCode >= 500)
                log.error( logBody );
            else
                log.warn( logBody );
        }

        return res.send(body);
    }
};
