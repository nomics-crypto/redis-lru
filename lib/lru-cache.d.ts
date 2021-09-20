export default class LRUCache {
    private cache;
    private pruneJob;
    constructor();
    get(key: string): Promise<any>;
    set(key: string, value: any, maxAge: number): Promise<any>;
    stop(): void;
}
