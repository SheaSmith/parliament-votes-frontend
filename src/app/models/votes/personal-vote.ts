import { Member } from "../organisational/member";
import { Vote } from "./vote";

export class PersonalVote extends Vote {
    member: Member;
    proxy: boolean;

    constructor(get: any) {
        super(get);
        this.member = new Member(get.member);
        this.proxy = get.proxy;
    }
}