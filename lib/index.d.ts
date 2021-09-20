export default function <T>(key: string, maxAge: number, value: () => Promise<T>): Promise<any>;
