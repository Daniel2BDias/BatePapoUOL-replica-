//variáveis globais

let inputLogin = document.querySelector('#inputLogin');
let inputMsg = document.querySelector('#inputMsg');
let nomeUsuario;
let mensagensGeral = [];
let keepLogin;
let atualizaChat;

inputLogin.addEventListener('keyup', loginEnter);
inputMsg.addEventListener('keyup', enviaEnter);

//funções gerais

function loginEnter(enter) {
    enter = enter.which || enter.keyCode;
    if (enter === 13){
        
        login();
    }
}

function login() {
 
 const loginPage = document.querySelector('.login');
 const errorMsg = document.querySelector('#errorlogin'); 

  nomeUsuario = document.querySelector('#inputLogin').value;

  const converteObjeto = { name: `${nomeUsuario}` };
  
    
    if(nomeUsuario === null || nomeUsuario === undefined || nomeUsuario === "" || nomeUsuario.length < 3){
        errorMsg.innerHTML = '**Nome de Usuário Inválido**';
        return;
    }
    
    nomeUsuario = converteObjeto;


    const cadastroUsuario = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nomeUsuario);
    
    cadastroUsuario.then(sucesso);
    function sucesso(resposta){
        console.log(resposta.data);
        loginPage.classList.add('hidden');
    }

    keepLogin = setInterval(verificaLogin, 5000);

    cadastroUsuario.catch(fracasso);
    function fracasso(erro){
        console.log(erro);
        errorMsg.innerHTML = '**Nome de Usuário em Uso**'
    }

}

function enviaEnter (enter){
    enter = enter.which || enter.keyCode;
    if (enter === 13){
        
        enviarMsg();
    }
}
function enviarMsg(){
    const msgContent = document.querySelector('#inputMsg').value;
    let who;
    let toWho;
    let msgtype;
    if(toWho == 'Todos'){
        msgtype = "message";
    } else {
        msgtype = "private-message";
    }

    const msgFormatada = {
        from: `${nomeUsuario}`,
        to: `${toWho}`,
        text: `${msgContent}`,
        type: `${msgtype}`
    };

    if(msgContent === undefined || msgContent === null){
        return;
    }

    const requisitionMsg = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', msgFormatada);

    requisitionMsg.then(foi);

    function foi(resposta) {
        console.log(resposta.data);
        recupararMensagens();
    }
    requisitionMsg.catch(nFoi);

    function nFoi(resposta){
        console.log(resposta.data);
        window.location.reload();
    };
}

function recupararMensagens(){
    const mensagens = document.querySelector('section');

    const reqMensagens = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');

    reqMensagens.then();

    reqMensagens.catch();
}

function verificaLogin() {
    const aindaLogado = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nomeUsuario);
    aindaLogado.then();
    aindaLogado.catch(logoff);
}

function sucesso(resposta){
    alert(resposta.data);
}

function fracasso(erro){
    alert(`${erro}`);
}

function logoff() {
    clearInterval(keepLogin);
    window.location.reload();
}

