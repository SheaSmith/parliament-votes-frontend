import { Member } from "../organisational/member";
import { Parliament } from "../organisational/parliament";
import { Question } from "../question";

export class Bill {
    id: number;
    title: string;
    description: string;
    number: string;
    lastUpdated: Date;
    members: Member[];
    type: BillType;
    parliaments: Parliament[];
    questions: Question[];

    constructor(get: any) {
        this.id = get.id;
        this.title = get.title;
        this.description = get.description;
        this.number = get.number;
        this.lastUpdated = get.lastUpdated;
        this.members = get.members == null ? null : get.members.map(m => new Member(m));
        this.type = BillType[get.type as string];
        this.parliaments = get.parliaments.map(p => new Parliament(p));
        this.questions = get.questions == null ? null : get.questions.map(q => new Question(q));
    }
}

export enum BillType {
    Government,
    Members,
    Private,
    Local
}