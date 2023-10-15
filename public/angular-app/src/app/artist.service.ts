import { Painting } from "./painting.service";

export class Artist {
  #_id! : string;
  #name! : string;
  #country! : string;
  #paintings! : Painting[]

  get _id(): string { return this.#_id}
  get name(): string { return this.#name}
  get country(): string { return this.#country}
  get paintings(): Painting[] { return this.#paintings}

  set name(name: string) {this.#name = name}
  set country(country: string) {this.#country = country}
  set paintings(paintings: Painting[]) {this.#paintings = paintings}

  constructor(id : string, name : string, country : string, paintings : Painting[]){
    this.#_id = id;
    this.#name = name;
    this.#country = country;
    this.#paintings = paintings;
  }
}
export class ArtistService {

  constructor() { }
}
