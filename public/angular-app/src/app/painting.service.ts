// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })

export class Painting {
  #_id!: string;
  #name!: string;
  #year!: number;

  get _id(): string { return this.#_id }
  get name(): string { return this.#name }
  get year(): number { return this.#year }

  set name(name: string) { this.#name = name; }
  set year(year: number) { this.#year = year; }

  constructor(id: string, name: string, year: number) {
    this.#_id = id;
    this.#name = name;
    this.#year = year;

  }
}
export class PaintingService {

  constructor() { }
}
