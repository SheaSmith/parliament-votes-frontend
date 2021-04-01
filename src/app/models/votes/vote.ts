export abstract class Vote {
    id: number;
    position: boolean;
    complexPosition: string;

    constructor(get: any) {
        this.id = get.id;
        this.position = get.position;
        this.complexPosition = get.complexPosition;
    }
}