import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { VotesBarComponent } from './components/home/question-list-item/votes-bar/votes-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuestionListItemComponent } from './components/home/question-list-item/question-list-item.component';
import { QuestionComponent } from './components/question/question.component';
import { PieGraphComponent } from './components/question/pie-graph/pie-graph.component';
import { MpPictureComponent } from './components/mp-picture/mp-picture.component';
import { OrdinalPipe } from './pipes/ordinal.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    QuestionListItemComponent,
    VotesBarComponent,
    FooterComponent,
    QuestionComponent,
    PieGraphComponent,
    MpPictureComponent,
    OrdinalPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
