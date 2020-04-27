export class Hero {
  id: number;
  name: string;

  constructor(name) {
    this.name = name;
  }

  myName() {
    return this.name;
  }
}

let hero = new Hero('asdasd');
console.log(hero.myName());
