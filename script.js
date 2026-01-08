class Heroi {
  constructor(nome, idade, tipo){
    this.nome = nome;
    this.idade = idade;
    this.tipo = tipo;
  }
    Atacar(){
      let ataque = "atacou usando";
      if (this.tipo === "Guerreiro"){
        alert("O "+ this.tipo + " " + ataque + " Espada!");
      } else if (this.tipo === "Mago"){
        alert("O "+ this.tipo + " " + ataque + " Magia!");
      } else if (this.tipo === "Monge"){
        alert("O "+ this.tipo + " " + ataque + " Artes Marciais!");
      } else if (this.tipo === "Ninja"){
        alert("O "+ this.tipo + " " + ataque + " Shuriken!");
      } else {
        alert("Tipo de herói desconhecido!");
      }
    }
}

let nome = prompt("Qual é o Nome do herói?");
let idade = prompt("Qual é a Idade do herói?");
let tipo = prompt("Qual é o Tipo do herói? Guerreiro, Mago, Monge ou Ninja?");

let heroi = new Heroi(nome, idade, tipo);
heroi.Atacar();