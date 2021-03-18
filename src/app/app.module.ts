import { AppServiceService } from './app-service.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HeaderComponent } from './header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TreeComponent } from './tree/tree.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import {MatTreeModule} from '@angular/material/tree';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreviewComponent } from './preview/preview.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TreeComponent,
    PreviewComponent,
    EditComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatInputModule,
    MatTreeModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AppServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
