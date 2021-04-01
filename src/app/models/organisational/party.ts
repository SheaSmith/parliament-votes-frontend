export class Party {
    id: number;
    name: string;
    logoUrl: string;
    colour: string;

    constructor(get: any) {
        this.id = get.id;
        this.name = get.name;
        this.logoUrl = get.logoUrl;
        this.colour = get.colour;
    }
}