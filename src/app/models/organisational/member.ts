import { Tenure } from "./tenure";

export class Member {
    id: number;
    name: string;
    imageUrl: string;
    imageCopyright: string;
    tenures: Tenure[];

    constructor(get: any) {
        this.id = get.id;
        this.name = get.name;
        this.imageUrl = get.imageUrl;
        this.imageCopyright = get.imageCopyright;
        this.tenures = get.tenures.map(t => new Tenure(t));
    }
}