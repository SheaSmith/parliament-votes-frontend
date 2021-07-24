import { Config } from "../config";
import { Member } from "../organisational/member";
import { Parliament } from "../organisational/parliament";
import { Bill } from "./bill";

export class SupplementaryOrderPaper {
    id: number;
    number: number;
    lastUpdated: Date;
    date: Date;
    parliament: Parliament;
    member: Member;
    amendingBill: Bill;
    type: SupplementaryOrderPaperType;

    constructor(get: any, config: Config) {
        this.id = get.id;
        this.number = get.number;
        this.lastUpdated = new Date(get.lastUpdated);
        this.date = new Date(get.date);
        this.parliament = new Parliament(config.parliaments[get.parliamentNumber]);
        this.member = new Member(config.members[get.member]);
        this.amendingBill = get.amendingBill == null ? null : new Bill(get.amendingBill, config);
        this.type = SupplementaryOrderPaperType[get.type as string];
    }
}

export enum SupplementaryOrderPaperType {
    Government,
    Members
}