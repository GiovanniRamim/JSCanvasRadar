function salvarFormulario(){
    var tempo = document.getElementById("AP-INPUT-TEMPO").value;
    var nome = document.getElementById("AP-INPUT-NOME").value;
    var distancia = document.getElementById("AP-INPUT-DISTANCIA").value;
    var velocidade = document.getElementById("AP-INPUT-VELOCIDADE").value;
    var posX = document.getElementById("AP-INPUT-POSICAOX").value;
    var posY = document.getElementById("AP-INPUT-POSICAOY").value;
    var posZ = document.getElementById("AP-INPUT-POSICAOZ").value;
    console.log({
        tempo: tempo,
        nome: nome,
        distancia: distancia,
        velocidade: velocidade,
        posicaoX: posX,
        posicaoY: posY,
        posicaoZ: posZ
    });
}