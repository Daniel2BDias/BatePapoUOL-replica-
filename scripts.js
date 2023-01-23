//variáveis globais

let inputLogin = document.querySelector('#inputLogin');
let inputMsg = document.querySelector('#inputMsg');
let nomeUsuario;
let nomeSemConverter;
let mensagensGeral = [];
let keepLogin;
let atualizaChat;
let lastMessage;

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
 const loading = document.querySelector('.loading');
 const cover = document.querySelector('.cover');

  nomeUsuario = document.querySelector('#inputLogin').value;

  const converteObjeto = { name: `${nomeUsuario}` };
  
    
    if(nomeUsuario === null || nomeUsuario === undefined || nomeUsuario === "" || nomeUsuario.length < 3){
        errorMsg.innerHTML = '**Nome de Usuário Inválido**';
        return;
    }
    
    nomeSemConverter = nomeUsuario;
    nomeUsuario = converteObjeto;


    const cadastroUsuario = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nomeUsuario);

    loading.classList.remove('hidden');
    cover.classList.add('hidden');
    
    cadastroUsuario.then(sucesso);
    function sucesso(resposta){
        console.log(resposta.data);
        loginPage.classList.add('hidden');
        keepLogin = setInterval(verificaLogin, 5000);
        atualizaChat = setInterval(recuperarMensagens(), 3000);
        recuperarMensagens();
    }

    

    cadastroUsuario.catch(fracasso);
    function fracasso(erro){
        console.log(erro);
        errorMsg.innerHTML = '**Nome de Usuário em Uso**'
        loading.classList.add('hidden');
        cover.classList.remove('hidden');
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

    let toWho = 'Todos';
    let msgtype;
    if(toWho == 'Todos'){
        msgtype = "message";
    } else {
        msgtype = "private-message";
    }

    let msgFormatada = {};

    msgFormatada.from = `${nomeSemConverter}`;
    msgFormatada.to = `${toWho}`;
    msgFormatada.text = `${msgContent}`;
    msgFormatada.type = `${msgtype}`;


    if(msgContent === undefined || msgContent === null){
        return;
    }

    const requisitionMsg = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', msgFormatada);

    requisitionMsg.then(recuperarMensagens());

    requisitionMsg.catch(nFoi);

    function nFoi(resposta){
        console.log(resposta.data);
        console.log(msgFormatada);
    };
}

function recuperarMensagens(){
    const mensagens = document.querySelector('section');
    
    mensagens.innerHTML = ``;

    const reqMensagens = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');

    reqMensagens.then(mostrarmsgs);

    function mostrarmsgs (resposta) {
        mensagensGeral = resposta.data
        for(let i = 0; i < mensagensGeral.length; i++){

            if (mensagensGeral[i].type === "status"){
            mensagens.innerHTML += `<div class="status" data-test="message">
            <span class="time">(${mensagensGeral[i].time})</span> <span class="user">${mensagensGeral[i].from}</span> para <span class="towho">${mensagensGeral[i].to}</span>: <span class="msg">${mensagensGeral[i].text}</span>
            </div>`;
            } else if (mensagensGeral[i].type === 'message'){
                mensagens.innerHTML += `<div class="message" data-test="message">
            <span class="time">(${mensagensGeral[i].time})</span> <span class="user">${mensagensGeral[i].from}</span> para <span class="towho">${mensagensGeral[i].to}</span>: <span class="msg">${mensagensGeral[i].text}</span>
            </div>`;
            } else if (mensagensGeral[i].type === "private-message" && mensagensGeral[i].from === `${nomeUsuario}` || mensagensGeral[i].to === `${nomeUsuario}`){
                mensagens.innerHTML += `<div class="pvt-message" data-test="message">
            <span class="time">(${mensagensGeral[i].time})</span> <span class="user">${mensagensGeral[i].from}</span> reservadamente para <span class="towho">${mensagensGeral[i].to}</span>: <span class="msg">${mensagensGeral[i].text}</span>
            </div>`;
            }
            
            
        }
        const queroVerEsse = document.querySelector('section div');
            queroVerEsse.scrollIntoView();
    }

    reqMensagens.catch(nDeu);

    function nDeu(resposta){
        console.log("Unable to recover messages from server", "Error" + resposta.status);
        recuperarMensagens();
    }
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
    clearInterval(atualizaChat);
    window.location.reload();
}