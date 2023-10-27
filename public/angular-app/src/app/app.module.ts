import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule, routes } from './app-routing.module'
import { AuthenticationInterceptor } from './authentication.interceptor';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { ArtistsComponent } from './artists/artists.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ArtistComponent } from './artist/artist.component';
import { PaintingComponent } from './painting/painting.component';
import { NewArtistComponent } from './new-artist/new-artist.component';
import { EditArtistComponent } from './edit-artist/edit-artist.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { AddPaintingComponent } from './add-painting/add-painting.component';
import { EditPaintingComponent } from './edit-painting/edit-painting.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HomeComponent,
    ArtistsComponent,
    NavigationComponent,
    ArtistComponent,
    PaintingComponent,
    NewArtistComponent,
    EditArtistComponent,
    UserRegisterComponent,
    UserLoginComponent,
    AddPaintingComponent,
    EditPaintingComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule.forRoot(routes)

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
