const detalhes = JSON.parse(localStorage.getItem("detalhes")) || {
    nome: "",
    jogador: "",
    classe: "",
    idade: "",
    origem: "",
    patente: "",
    dextra: "0",
    corpo: "0",
    exPara: "0",
};
const nome = $("#nome");
const jogador = $("#jogador");
const classe = $("#classe");
const idade = $("#idade");
const sexo = $("#sexo");
const origem = $("#origem");
const patente = $("#patente");
const dextra = $("#dextra");
const corpo = $("#corpo");
const exPara = $("#exPara");


let aux = {
    nome: detalhes.nome,
    jogador: detalhes.jogador,
    classe: detalhes.classe,
    idade: detalhes.idade,
    origem: detalhes.origem,
    patente: detalhes.patente,
    dextra: detalhes.dextra,
    corpo: detalhes.corpo,
    exPara: detalhes.exPara,
}

iniciarDetalhes(detalhes);

nome.blur(function (e) { 
    e.preventDefault();
    aux.nome = $(this)[0].value;
    localStorage.setItem("detalhes", JSON.stringify(aux));
});

jogador.blur(function (e) { 
    e.preventDefault();
    aux.jogador = $(this)[0].value;
    localStorage.setItem("detalhes", JSON.stringify(aux));
});

classe.blur(function (e){
    e.preventDefault();
    aux.classe =  $(this)[0].value;
    localStorage.setItem("detalhes", JSON.stringify(aux));
})

idade.blur(function (e){
    e.preventDefault();
    aux.idade =  $(this)[0].value;
    localStorage.setItem("detalhes", JSON.stringify(aux));
})

sexo.blur(function (e){
    e.preventDefault();
    aux.sexo =  $(this)[0].value;
    localStorage.setItem("detalhes", JSON.stringify(aux));
})

origem.blur(function (e){
    e.preventDefault();
    aux.origem =  $(this)[0].value;
    localStorage.setItem("detalhes", JSON.stringify(aux));
})

patente.blur(function (e){
    e.preventDefault();
    aux.patente =  $(this)[0].value;
    localStorage.setItem("detalhes", JSON.stringify(aux));
})

dextra.blur(function (e){
    e.preventDefault();
    aux.dextra =  $(this)[0].value;
    localStorage.setItem("detalhes", JSON.stringify(aux));
})

corpo.blur(function (e){
    e.preventDefault();
    aux.corpo =  $(this)[0].value;
    localStorage.setItem("detalhes", JSON.stringify(aux));
})

exPara.blur(function (e){
    e.preventDefault();
    aux.exPara =  $(this)[0].value;
    localStorage.setItem("detalhes", JSON.stringify(aux));
})





function iniciarDetalhes(item) {
    nome.val(item.nome);
    jogador.val(item.jogador);
    classe.val(item.classe);
    idade.val(item.idade);
    sexo.val(item.sexo);
    origem.val(item.origem);
    patente.val(item.patente);
    dextra.val(item.dextra);
    corpo.val(item.corpo);
    exPara.val(item.exPara);
}