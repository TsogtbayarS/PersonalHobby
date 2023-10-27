import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { AddPaintingComponent } from "./add-painting/add-painting.component";
import { ArtistComponent } from "./artist/artist.component";
import { ArtistsComponent } from "./artists/artists.component";
import { EditArtistComponent } from "./edit-artist/edit-artist.component";
import { EditPaintingComponent } from "./edit-painting/edit-painting.component";
import { NewArtistComponent } from "./new-artist/new-artist.component";
import { PaintingComponent } from "./painting/painting.component";
import { UserLoginComponent } from "./user-login/user-login.component";
import { UserRegisterComponent } from "./user-register/user-register.component";
import { environment } from "src/environments/environment.development";

export const routes: Routes = [
    { path: environment.rootUrl, component: ArtistsComponent },
    { path: environment.artists, component: ArtistsComponent },
    { path: environment.artistsUrl + environment.urlArtistIdParameterWithoutSlash, component: ArtistComponent },
    { path: environment.artistsUrl + environment.urlArtistIdParameter + environment.paintingsUrl + environment.urlPaintingIdParameterWithoutSlash, component: PaintingComponent },
    { path: environment.newArtist, component: NewArtistComponent },
    { path: environment.artistsUrl + environment.urlArtistIdParameter + environment.edit, component: EditArtistComponent },
    { path: environment.artistsUrl + environment.urlArtistIdParameter + environment.newPainting, component: AddPaintingComponent },
    { path: environment.artistsUrl + environment.urlArtistIdParameter + environment.paintingsUrl + environment.urlPaintingIdParameter + environment.edit, component: EditPaintingComponent },
    { path: environment.register, component: UserRegisterComponent },
    { path: environment.login, component: UserLoginComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
