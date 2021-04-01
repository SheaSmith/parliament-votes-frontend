export class Meta<T> {
    length: number;
    content: T[];

    constructor(get: any, content: T[]) {
        this.length = get.length;
        this.content = content;
    }
}