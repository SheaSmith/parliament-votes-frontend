import { AfterViewChecked, AfterViewInit } from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tooltip } from 'bootstrap';
import { Subscription } from 'rxjs';
import { Config } from 'src/app/models/config';
import { BillType } from 'src/app/models/legislation/bill';
import { Member } from 'src/app/models/organisational/member';
import { Party } from 'src/app/models/organisational/party';
import { ConfigService } from 'src/app/services/config.service';
import { QuestionsService } from 'src/app/services/questions.service';
import { getTextClass } from 'src/app/text-color-utility';
import { Question, QuestionType, Stage } from '../../models/question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, OnDestroy, AfterViewChecked {

  question: Question;
  configSubscription: Subscription;

  votesInFavour: { numberOfVotes: number, party: Party, member: Member, splitPartyVotes: Member[], proxy: boolean }[] = null;
  totalInFavour = -1;

  votesOpposed: { numberOfVotes: number, party: Party, member: Member, splitPartyVotes: Member[], proxy: boolean }[] = null;
  totalOpposed = -1;

  otherVotes: { [complexPosition: string]: { numberOfVotes: number, party: Party, member: Member, splitPartyVotes: Member[], proxy: boolean }[] } = null;
  totalOther: { [complexPosition: string]: number } = {};

  notVoting: { numberOfVotes: number, party: Party, member: Member, splitPartyVotes: Member[], proxy: boolean }[] = null;
  totalNotVoting = -1;

  getTextClass = getTextClass;
  Stage = Stage;
  QuestionType = QuestionType;
  BillType = BillType;

  constructor(private route: ActivatedRoute, private questionsService: QuestionsService, private configService: ConfigService) { }

  ngOnInit(): void {
    this.configSubscription = this.configService.getConfig().subscribe(c => {
      this.route.params.subscribe(p => {
        this.questionsService.getQuestion(p['id'], c).subscribe(q => {
          this.question = q;

          if (this.question.partyVotes != null) {
            // Initialise the values. We want these to be null for voice votes
            this.votesInFavour = [];
            this.votesOpposed = [];
            this.otherVotes = {};
            this.notVoting = [];

            // Find all parties and how many votes they should have
            const partiesAllVotes: { [partyId: number]: { votes: number, party: Party, members: Member[] } } = {};
            const partiesMaxVotes: { [partyId: number]: number } = {};
            const independentMaxVotes: Member[] = [];

            // Iterate through all members. As it's a dictionary, we need to just look at the values
            Object.values(c.members).forEach((m: Member) => {
              // Find any tenure that matches the date the question was put
              const tenuresForDate = m.tenures.filter(t => t.start <= this.question.timestamp && (t.end >= this.question.timestamp || t.end == null));

              // If there are any matching tenures, the MP was in parliament at the time
              if (tenuresForDate.length != 0) {
                // Find the first (and hopefully only!) tenure that matches
                const tenure = tenuresForDate[0];

                // No party, so must be an independent
                if (tenure.party == null) {
                  independentMaxVotes.push(m);
                }
                else {
                  // They have a party, so add them to their party's max vote total
                  var partyMaxVotes = partiesAllVotes[tenure.party.id];

                  if (partyMaxVotes == null) {
                    partyMaxVotes = { votes: 1, party: tenure.party, members: [m] };
                    partiesAllVotes[tenure.party.id] = partyMaxVotes;
                    partiesMaxVotes[tenure.party.id] = 1;
                  }
                  else {
                    partyMaxVotes.votes++;
                    partiesMaxVotes[tenure.party.id]++;
                    partyMaxVotes.members.push(m);
                  }
                }
              }
            });

            // Iterate through all party votes
            this.question.partyVotes.forEach(p => {
              if (p.party != null) {
                // Remove the number vote from the max votes for this party, as they have evidently voted
                partiesAllVotes[p.party.id].votes -= p.numberOfVotes;

                // Handle split party votes. Don't think there's ever been a scenario where there's only been a partial split party vote, but it's theoretically possible
                if (p.splitPartyVotes.length == 0) {
                  partiesAllVotes[p.party.id].members = [];
                  console.log(partiesAllVotes);
                }
                else {
                  partiesAllVotes[p.party.id].members = partiesAllVotes[p.party.id].members.filter(m => p.splitPartyVotes.map(m => m.id).indexOf(m.id) == -1);
                }
              }
              else {
                // It's an independent who has voted, so remove them
                independentMaxVotes.splice(independentMaxVotes.map(m => m.id).indexOf(p.member.id), 1);
              }

              // We have a 'other' vote, where the member hasn't given permission for this party to party vote on their behalf.
              // We still need to remove these from being counted in the 'not voting' columns
              if (p.member != null && p.member.getTenureAtDate(this.question.timestamp).party != null) {
                partiesAllVotes[p.member.getTenureAtDate(this.question.timestamp).party.id].members.splice(partiesAllVotes[p.member.getTenureAtDate(this.question.timestamp).party.id].members.map(m => m.id).indexOf(p.member.id), 1);
                partiesAllVotes[p.member.getTenureAtDate(this.question.timestamp).party.id].votes--;
              }

              // Check the position and add to the applicable list
              if (p.position == true) {
                this.votesInFavour.push({ numberOfVotes: p.numberOfVotes, party: p.party, member: p.member, splitPartyVotes: p.splitPartyVotes, proxy: false });
              }
              else if (p.position == false) {
                this.votesOpposed.push({ numberOfVotes: p.numberOfVotes, party: p.party, member: p.member, splitPartyVotes: p.splitPartyVotes, proxy: false });
              }
              else if (p.complexPosition != null) {
                // Bit of extra logic since we're dealing with a dictionary of the different positions
                const sharesPosition = this.otherVotes[p.complexPosition];

                if (sharesPosition == null) {
                  const position = [{ numberOfVotes: p.numberOfVotes, party: p.party, member: p.member, splitPartyVotes: p.splitPartyVotes, proxy: false }];
                  this.otherVotes[p.complexPosition] = position;
                }
                else {
                  sharesPosition.push({ numberOfVotes: p.numberOfVotes, party: p.party, member: p.member, splitPartyVotes: p.splitPartyVotes, proxy: false })
                }
              }
            });

            // Add the unaccounted party votes to the not voting totals
            Object.values(partiesAllVotes).forEach(p => {
              if (partiesMaxVotes[p.party.id] == p.votes) {
                p.members = [];
              }
              this.notVoting.push({ numberOfVotes: p.votes, party: p.party, member: null, splitPartyVotes: p.members, proxy: false });
            });

            // Any independents who haven't voted need to be dealt with as well
            independentMaxVotes.forEach(p => {
              this.notVoting.push({ numberOfVotes: 1, party: null, member: p, splitPartyVotes: [], proxy: false });
            });
          }

          if (this.question.personalVotes != null) {
            // Initialise the values. We want these to be null for voice votes
            this.votesInFavour = [];
            this.votesOpposed = [];
            this.otherVotes = {};
            this.notVoting = [];

            // Find all parties and how many votes they should have
            const partiesAllVotes: { [partyId: number]: { votes: number, party: Party, members: Member[] } } = {};
            const independentMaxVotes: Member[] = [];

            // Iterate through all members. As it's a dictionary, we need to just look at the values
            Object.values(c.members).forEach((m: Member) => {
              // Find any tenure that matches the date the question was put
              const tenuresForDate = m.tenures.filter(t => t.start <= this.question.timestamp && (t.end >= this.question.timestamp || t.end == null));

              // If there are any matching tenures, the MP was in parliament at the time
              if (tenuresForDate.length != 0) {
                // Find the first (and hopefully only!) tenure that matches
                const tenure = tenuresForDate[0];

                // No party, so must be an independent
                if (tenure.party == null) {
                  independentMaxVotes.push(m);
                }
                else {
                  // They have a party, so add them to their party's max vote total
                  var partyMaxVotes = partiesAllVotes[tenure.party.id];

                  if (partyMaxVotes == null) {
                    partyMaxVotes = { votes: 1, party: tenure.party, members: [m] };
                    partiesAllVotes[tenure.party.id] = partyMaxVotes;
                  }
                  else {
                    partyMaxVotes.votes += 1;
                    partyMaxVotes.members.push(m);
                  }
                }
              }
            });

            // Iterate through all personal votes
            this.question.personalVotes.forEach(p => {
              // Find the party for the specific member at the time this question was put
              const partyAtTime = p.member.tenures.filter(t => t.start <= this.question.timestamp && (t.end == null || t.end >= this.question.timestamp))[0].party;

              if (partyAtTime != null) {
                // Remove the number vote from the max votes for this party, as they have evidently voted
                partiesAllVotes[partyAtTime.id].votes -= 1;
                // Remove the member from the list of voters
                partiesAllVotes[partyAtTime.id].members.splice(partiesAllVotes[partyAtTime.id].members.map(m => m.id).indexOf(p.member.id), 1);
              }
              else {
                // It's an independent who has voted, so remove them
                independentMaxVotes.splice(independentMaxVotes.map(m => m.id).indexOf(p.member.id), 1);
              }

              let partyIndex = -1;

              // If they voted in favour and have a party
              if (p.position == true && partyAtTime != null) {
                // Find if we already have the party in our list
                const partiesMatch = this.votesInFavour.filter(v => v.party != null && v.party.id == partyAtTime.id);

                // We do, so set the index where it's at
                if (partiesMatch.length != 0) {
                  partyIndex = this.votesInFavour.indexOf(partiesMatch[0]);
                }

                if (partyIndex == -1) {
                  // Party doesn't exist - push new array item for the party
                  this.votesInFavour.push({ numberOfVotes: 1, party: partyAtTime, member: null, splitPartyVotes: [p.member], proxy: p.proxy });
                }
                else {
                  // Party already exists, so increase the number of votes by 1 and add the member to the list
                  this.votesInFavour[partyIndex].numberOfVotes += 1;
                  this.votesInFavour[partyIndex].splitPartyVotes.push(p.member);
                }
              }
              // If they voted against and have a party
              else if (p.position == false && partyAtTime != null) {
                // Find if we already have the party in our list
                const partiesMatch = this.votesOpposed.filter(v => v.party != null && v.party.id == partyAtTime.id);

                // We do, so set the index where it's at
                if (partiesMatch.length != 0) {
                  partyIndex = this.votesOpposed.indexOf(partiesMatch[0]);
                }

                if (partyIndex == -1) {
                  // Party doesn't exist - push new array item for the party
                  this.votesOpposed.push({ numberOfVotes: 1, party: partyAtTime, member: null, splitPartyVotes: [p.member], proxy: p.proxy });
                }
                else {
                  // Party already exists, so increase the number of votes by 1 and add the member to the list
                  this.votesOpposed[partyIndex].numberOfVotes += 1;
                  this.votesOpposed[partyIndex].splitPartyVotes.push(p.member);
                }
              }
              // If they have a complex position (generally Abstain) and have a party
              else if (p.complexPosition != null && partyAtTime != null) {
                // Find if we already have the party in our list
                let partiesMatch = [];
                if (this.otherVotes[p.complexPosition] != null) {
                  partiesMatch = this.otherVotes[p.complexPosition].filter(v => v.party != null && v.party.id == partyAtTime.id);
                }

                // We do, so set the index where it's at
                if (partiesMatch.length != 0) {
                  partyIndex = this.otherVotes[p.complexPosition].indexOf(partiesMatch[0]);
                }

                if (partyIndex == -1) {
                  // Party doesn't exist - push new array item for the party
                  const newEntry = { numberOfVotes: 1, party: partyAtTime, member: null, splitPartyVotes: [p.member], proxy: p.proxy };
                  if (this.otherVotes[p.complexPosition] == null) {
                    // This complex position isn't in our dictionary yet, so add it
                    this.otherVotes[p.complexPosition] = [newEntry];
                  }
                  else {
                    // Already exists in dictionary, so simply append our new entry
                    this.otherVotes[p.complexPosition].push(newEntry);
                  }
                }
                else {
                  // Party already exists, so increase the number of votes by 1 and add the member to the list
                  this.otherVotes[p.complexPosition][partyIndex].numberOfVotes += 1;
                  this.otherVotes[p.complexPosition][partyIndex].splitPartyVotes.push(p.member);
                }
              }
              // They voted in favour and are an independent. Simply add to the votes in favour list
              else if (p.position == true && partyAtTime == null) {
                this.votesInFavour.push({ numberOfVotes: 1, party: null, member: p.member, splitPartyVotes: [], proxy: p.proxy });
              }
              // They voted against and are an indepedent. Simply add to the votes opposed list.
              else if (p.position == false && partyAtTime == null) {
                this.votesOpposed.push({ numberOfVotes: 1, party: null, member: p.member, splitPartyVotes: [], proxy: p.proxy });
              }
              // They have a complex position and are an independent
              else if (p.complexPosition != null && partyAtTime == null) {
                const newEntry = { numberOfVotes: 1, party: null, member: p.member, splitPartyVotes: [], proxy: p.proxy };
                // Check if the complex position is already in our dictionary
                if (this.otherVotes[p.complexPosition] == null) {
                  // It's not, so add it
                  this.otherVotes[p.complexPosition] = [newEntry]
                }
                else {
                  // It is, simply push our new entry
                  this.otherVotes[p.complexPosition].push(newEntry);
                }
              }
            });

            // Add the unaccounted personal votes to the not voting totals
            Object.values(partiesAllVotes).forEach(p => {
              this.notVoting.push({ numberOfVotes: p.votes, party: p.party, member: null, splitPartyVotes: p.members, proxy: false });
            });

            // Any independents who haven't voted need to be dealt with as well
            independentMaxVotes.forEach(p => {
              this.notVoting.push({ numberOfVotes: 1, party: null, member: p, splitPartyVotes: [], proxy: false });
            });
          }

          if (this.votesInFavour != null) {
            this.votesInFavour.sort((a, b) => {
              return b.numberOfVotes - a.numberOfVotes;
            });

            this.totalInFavour = this.votesInFavour.map(v => v.numberOfVotes).reduce((a, b) => a + b, 0);
          }

          if (this.votesOpposed != null) {
            this.votesOpposed.sort((a, b) => {
              return b.numberOfVotes - a.numberOfVotes;
            });

            this.totalOpposed = this.votesOpposed.map(v => v.numberOfVotes).reduce((a, b) => a + b, 0);
          }

          if (this.notVoting != null) {
            this.notVoting.sort((a, b) => {
              return b.numberOfVotes - a.numberOfVotes;
            });

            this.totalNotVoting = this.notVoting.map(v => v.numberOfVotes).reduce((a, b) => a + b, 0);

            this.notVoting = this.notVoting.filter(v => v.numberOfVotes != 0);
          }

          if (this.otherVotes != null) {
            Object.keys(this.otherVotes).forEach(k => {
              this.otherVotes[k].sort((a, b) => {
                return b.numberOfVotes - a.numberOfVotes;
              });

              this.totalOther[k] = this.otherVotes[k].map(v => v.numberOfVotes).reduce((a, b) => a + b);
            });
          }
        });
      });
    })
  }

  ngAfterViewChecked() {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(t => new Tooltip(t));
  }

  ngOnDestroy() {
    if (this.configSubscription != null) {
      this.configSubscription.unsubscribe();
    }
  }

  getKeys(dictionary: any) {
    return Object.keys(dictionary);
  }

  filterQuestionsList(questions: Question[]): Question[] {
    return questions.filter(q => q.type == QuestionType.BillReading);
  }

}
