import { ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Config } from 'src/app/models/config';
import { ConfigService } from 'src/app/services/config.service';
import { QuestionsService } from 'src/app/services/questions.service';
import { StatisticsService } from 'src/app/services/statistics.service';
import { Meta } from '../../models/meta';
import { Question } from '../../models/question';
import { Topline } from '../../models/statistics/topline';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  toplineStats: Topline;
  meta: Meta<Question>;
  voteType: string = null;
  skip: number = 0;
  config: Config;

  Object = Object;

  configSubscription: Subscription;

  constructor(private statsService: StatisticsService, private questionsService: QuestionsService, private route: ActivatedRoute, private router: Router, private viewportScroller: ViewportScroller, private configService: ConfigService) { }

  ngOnInit(): void {
    this.configSubscription = this.configService.getConfig().subscribe(c => {
      this.config = c;
      this.statsService.getTopline().subscribe(t => this.toplineStats = t);

      this.route.queryParamMap.subscribe(p => {
        if (p['params']['page'] && !isNaN(p['params']['page'])) {
          this.skip = p['params']['page'] * 20 - 20;
        }
  
        if (p['params']['voteType'] && [ 'PartyVote', 'VoiceVote', 'PersonalVote', 'SplitPartyVote' ].indexOf(p['params']['voteType']) != -1) {
          this.voteType = p['params']['voteType'];
        }
  
        this.getQuestions();
      });
    });
    
  }

  ngOnDestroy() {
    if (this.configSubscription != null) {
      this.configSubscription.unsubscribe();
    }
  }

  setVoteType(voteType: string) {
    this.voteType = voteType;
    this.meta.content = [];
    this.skip = 0;
    this.setParameters();
    this.getQuestions();
  }

  private getQuestions() {
    this.questionsService.getRecentQuestions(this.skip, this.voteType, this.config).subscribe(m => {
      this.meta = m;

      // Reset the page if too long and remove meta for now
      if (this.skip > m.length) {
        this.meta = null;
        this.loadPage(1);
      }
    });
  }

  pageSelector(forwards = false) {
    this.loadPage(this.getCurrentPage() + (forwards ? 1 : -1));
  }

  loadPage(page: number) {
    this.skip = page * 20 - 20;
    this.getQuestions();
    this.setParameters();
    this.viewportScroller.scrollToAnchor('questions');
  }

  setParameters() {
    this.router.navigate([], { relativeTo: this.route, queryParams: { page: this.getCurrentPage() == 1 ? null : this.getCurrentPage(), voteType: this.voteType }, queryParamsHandling: 'merge' });
  }

  getPages() {
    var pages = [];
    var maxPagesAbove = 2;
    for (var i = this.getCurrentPage() > (this.getMaxPage() - 2) ? this.getCurrentPage() - this.getMaxPage() + 4 : 2; i != 0; i--) {
      const page = this.getCurrentPage() - i;

      if (page <= 0) {
        maxPagesAbove++;
      }
      else {
        pages.push(page);
      }
    }

    pages.push(this.getCurrentPage());

    for (var i = 1; i <= maxPagesAbove; i++) {
      const page = this.getCurrentPage() + i;

      if (page <= this.getMaxPage()) {
        pages.push(page);
      }
    }

    return pages;
  }

  getCurrentPage(): number {
    return (this.skip + 20) / 20;
  }

  getMaxPage(): number {
    return Math.floor((this.meta.length + 20) / 20);
  }

  showMaxPage(): boolean {
    return this.getPages().indexOf(this.getMaxPage()) == -1;
  }

  showMinPage(): boolean {
    return this.getPages().indexOf(1) == -1;
  }

}
