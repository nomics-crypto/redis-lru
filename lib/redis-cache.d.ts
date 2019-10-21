export default class RedisCache {
    get(key: any): Promise<any>;
    set(key: any, value: any, maxAge: any): Promise<unknown>;
}
