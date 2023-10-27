export class User {
  #username!: string;
  #name!: string;
  #password!: string;

  get username(): string { return this.#username }
  get name(): string { return this.#name }
  get password(): string { return this.#password }

  set username(username: string) { this.#username = username }
  set name(name: string) { this.#name = name }
  set password(password: string) { this.#password = password }

  constructor(username: string, name: string, password: string) {
    this.#name = name;
    this.#username = username;
    this.#password = password;
  }
}
export class UserService {

  constructor() { }
}
