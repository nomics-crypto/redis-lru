export default class RedisCache {
    private local;
    constructor();
    get(key: string): Promise<any>;
    set(key: string, value: any, maxAge: number): Promise<unknown>;
}
