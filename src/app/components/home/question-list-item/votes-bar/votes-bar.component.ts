import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/models/organisational/member';
import { Party } from 'src/app/models/organisational/party';
import { getTextClass } from 'src/app/text-color-utility';
declare var $;

@Component({
  selector: '[votes-bar]',
  templateUrl: './votes-bar.component.html',
  styleUrls: ['./votes-bar.component.scss']
})
export class VotesBarComponent implements OnInit {

  @Input()
  vote: {numberOfVotes: number, party: Party, member: Member}

  @Input()
  personalVote = false;

  @Input()
  inFavour = true;

  @Input()
  totalVotes: number;

  constructor() { }

  ngOnInit(): void {
  }

}
