const detalhes = JSON.parse(localStorage.getItem("detalhes")) || {
    nome: "",
    jogador: "",
    ocupacao: "",
    idade: "",
    nascimento: "",
    residencia: "",
    dextra: "0",
    corpo: "0",
    exPara: "0",
};
const nome = document.getElementById("nome");
const jogador = document.getElementById("jogador");
const ocupacao = document.getElementById("ocupacao");
const idade = document.getElementById("idade");
const sexo = document.getElementById("sexo");
const nascimento = document.getElementById("nascimento");
const residencia = document.getElementById("residencia");
const dextra = document.getElementById("dextra");
const corpo = document.getElementById("corpo");
const exPara = document.getElementById("exPara");

const tipos = [nome, jogador, ocupacao, idade, sexo, nascimento, residencia, dextra, corpo, exPara]

let aux = {
    nome: detalhes.nome,
    jogador: detalhes.jogador,
    ocupacao: detalhes.ocupacao,
    idade: detalhes.idade,
    nascimento: detalhes.nascimento,
    residencia: detalhes.residencia,
    dextra: detalhes.dextra,
    corpo: detalhes.corpo,
    exPara: detalhes.exPara,
}

iniciarDetalhes(detalhes);

nome.addEventListener("blur", () => {
    aux.nome = nome.value;
    console.log(detalhes)
    localStorage.setItem("detalhes", JSON.stringify(aux));
})

jogador.addEventListener("blur", () => {
    aux.jogador = jogador.value;
    localStorage.setItem("detalhes", JSON.stringify(aux));
})

ocupacao.addEventListener("blur", () => {
    aux.ocupacao = ocupacao.value;
    localStorage.setItem("detalhes", JSON.stringify(aux));
})

idade.addEventListener("blur", () => {
    aux.idade = idade.value;
    localStorage.setItem("detalhes", JSON.stringify(aux));
})

sexo.addEventListener("blur", () => {
    aux.sexo = sexo.value;
    localStorage.setItem("detalhes", JSON.stringify(aux));
})

residencia.addEventListener("blur", () => {
    aux.residencia = residencia.value;
    localStorage.setItem("detalhes", JSON.stringify(aux));
})

nascimento.addEventListener("blur", () => {
    aux.nascimento = nascimento.value;
    localStorage.setItem("detalhes", JSON.stringify(aux));
})

dextra.addEventListener("blur", () => {
    aux.dextra = dextra.value;
    localStorage.setItem("detalhes", JSON.stringify(aux));
})

corpo.addEventListener("blur", () => {
    aux.corpo = corpo.value;
    localStorage.setItem("detalhes", JSON.stringify(aux));
})

exPara.addEventListener("blur", () => {
    aux.exPara = exPara.value;
    localStorage.setItem("detalhes", JSON.stringify(aux));
})



function iniciarDetalhes(item) {
    nome.value = item.nome;
    jogador.value = item.jogador;
    ocupacao.value = item.ocupacao;
    idade.value = item.idade;
    sexo.value = item.sexo;
    residencia.value = item.residencia;
    nascimento.value = item.nascimento;
    dextra.value = item.dextra;
    corpo.value = item.corpo;
    exPara.value = item.exPara;
}