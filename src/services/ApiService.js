import axios from 'axios';
import AuthorizationService, { Config } from './AuthorizationService';
import { catchError, map } from "rxjs/operators";
import { from, of } from "rxjs";
import { Status } from "../common/Symbols";

const apiGateway = axios.create({
    baseURL: `${Config.getCenitHost()}/api/v3`,
    timeout: Config.timeoutSpan
});

apiGateway.interceptors.request.use(async config => {
    const accessToken = await AuthorizationService.getAccessToken().toPromise();
    if (!config.headers) {
        config.headers = {};
    }
    config.headers.Authorization = `Bearer ${accessToken}`;
    const xTenantId = AuthorizationService.getXTenantId();
    if (xTenantId) {
        config.headers['X-Tenant-Id'] = xTenantId;
    }

    return config;
});

//const ApiCache = {};

export const ApiResource = function () {

    let args = Array.prototype.slice.call(arguments).flat();
    let params = args[args.length - 1];
    let headers;
    let size;
    let onUploadProgress;
    let cancelToken;
    let responseType;

    if (params && params.constructor === Object) {
        params = args.pop();

        onUploadProgress = params.onUploadProgress;
        delete params.onUploadProgress;
        cancelToken = params.cancelToken;
        delete params.cancelToken;
        responseType = params.responseType;
        delete params.responseType;

        headers = params.headers;
        if (headers &&
            headers.constructor === Object &&
            ((size = Object.keys(params).length) === 1 || (size === 2 && params.params && params.params.constructor === Object))) {
            params = params.params || {}
        } else {
            headers = {}
        }
    } else {
        headers = params = {};
    }

    const config = {
        headers,
        params,
        onUploadProgress,
        cancelToken,
        responseType
    };

    this.path = '/' + args.join('/');

    this.get = () => from(
        apiGateway.get(this.path, config)
    ).pipe(
        map(response => {
            const { data } = response;
            if (data?.constructor === Object) {
                data[Status] = response.status;
            }
            return data;
        })
    );

    this.delete = () => from(
        apiGateway.delete(this.path, config)
    ).pipe(
        map(response => response && response.data)
    );

    this.post = data => from(
        apiGateway.post(this.path, data, config)
    ).pipe(
        map(response => {
            const { data } = response;
            if (data?.constructor === Object) {
                data[Status] = response.status;
            }
            return data;
        })
    );
};

const ErrorCallbacks = [];

const ConnectionRefusedCallbacks = [];

const API = {
    get: (...args) => {
        return (new ApiResource(...args)).get().pipe(
            catchError(e => {
                if (axios.isCancel(e)) {
                    throw e;
                }
                if (e.response) {
                    if (e.response && e.response.status !== 404 && e.response.status !== 403) {
                        ErrorCallbacks.forEach(callback => callback(e));
                    }
                } else {
                    ConnectionRefusedCallbacks.forEach(callback => callback(e));
                }
                return of(null);
            })
        )
    },

    post: (...args) => {
        const data = args.pop();
        return (new ApiResource(...args)).post(data).pipe(
            catchError(e => {
                if (e.response) {
                    switch (e.response.status) {
                        case 404:
                            break;
                        case 403:
                        case 422:
                            throw e;
                        default:
                            ErrorCallbacks.forEach(callback => callback(e));
                    }
                    return of(null);
                } else {
                    ConnectionRefusedCallbacks.forEach(callback => callback(e));
                }
                throw e;
            })
        );
    },

    delete: (...args) => {
        return (new ApiResource(...args)).delete().pipe(
            catchError(e => {
                if (axios.isCancel(e)) {
                    throw e;
                }
                if (e.response) {
                    switch (e.response.status) {
                        case 404:
                        case 422:
                            break;
                        default:
                            ErrorCallbacks.forEach(callback => callback(e));
                    }
                } else {
                    ConnectionRefusedCallbacks.forEach(callback => callback(e));
                }
                throw e;
            })
        );
    },

    onError: callback => ErrorCallbacks.push(callback),

    onConnectionRefused: callback => ConnectionRefusedCallbacks.push(callback)
};

export default API;
