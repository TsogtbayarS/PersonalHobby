import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { ArtistsComponent } from './artists/artists.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ArtistComponent } from './artist/artist.component';
import { PaintingsComponent } from './paintings/paintings.component';
import { PaintingComponent } from './painting/painting.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HomeComponent,
    ArtistsComponent,
    NavigationComponent,
    ArtistComponent,
    PaintingsComponent,
    PaintingComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot([
      {
        path: "",
        component: HomeComponent
      },
      {
        path: "artists",
        component: ArtistsComponent
      },
      {
        path: "artists/:artistId",
        component: ArtistComponent
      },
      {
        path: "artists/:artistId/paintings",
        component: PaintingsComponent
      },
      {
        path: "artists/:artistId/paintings/:paintingId",
        component: PaintingComponent
      }
    ])

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
