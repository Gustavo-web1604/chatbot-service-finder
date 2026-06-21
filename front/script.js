let dbDaApi = { services: {}, keywords: {} };

const CONTEXT_RULES = [
  { pattern: /quarantine|email externo|email.*cliente|cliente.*email|external.*mail|mail.*external/,   service: 'INTERNET MAIL' },
  { pattern: /criptograf|assinatura digital|email.*criptog|entrust|trust center/,                    service: 'ENTRUST' },
  { pattern: /assinatura.*outlook|outlook.*assinatura|desin kit|eforms/,                             service: 'EFORMS' },
  { pattern: /email|outlook|correio|caixa de entrada|inbox|mailbox|e-mail/,                          service: 'MS OUTLOOK' },

  { pattern: /imprim.*sap|sap.*imprim|nao imprime.*sap|sap.*nao imprime/,                            service: 'SAP PRINTING' },
  { pattern: /oracle.*bloqueado|bloqueado.*oracle|desbloquear.*oracle|autorizacao.*oracle/,          service: 'RL-ORA-AUTHORIZATION' },
  { pattern: /zeus/,                                                                                 service: 'RL-ORA-ZEUSP' },
  { pattern: /sap.*gui|sapgui|saplogon|logon.*sap|idioma.*sap|tema.*sap|sap.*idioma|sap.*tema|app.*sap|aplicativo.*sap|software.*sap/,  service: 'SAPGUI-SAPLOGON-APPLICATION' },
  { pattern: /\bsap\b/,                                                                                service: 'SAPGUI-SAPLOGON-APPLICATION' },

  { pattern: /windows.*hello|hello.*windows|biometria|desbloqueio.*biometrico|fingerprint/,          service: 'WH4B SERVICE' },
  { pattern: /senha.*admin|admin.*senha|acesso.*admin|liberacao.*admin|admin.*temporar|admin rights/,  service: 'SCCM CLIENT ADMIN RIGHTS |WORLD' },
  { pattern: /atualiz.*windows|windows.*atualiz|falha.*windows|bug.*windows|erro.*windows|windows.*trava/,  service: 'SCCM WINDOWS CLIENT OS' },
  { pattern: /instalar.*software|software.*instalar|instalar.*programa|programa.*instalar|software.*center|software center/,  service: 'SCCM PACKAGE INSTALLATION FAILURE' },
  { pattern: /usb.*bloqueado|bloqueado.*usb|habilitar.*usb|desabilitar.*usb|liberar.*usb|\busb\b/,   service: 'SCCM CLIENT USB ACCESS |WORLD' },
  { pattern: /driver.*hardware|hardware.*driver|controlador.*hardware/,                              service: 'SCCM CLIENT HARDWARE DRIVERS' },
  { pattern: /toolkit|sccm.*agent|it workplace/,                                                     service: 'IT WORKPLACE TOOLKIT AND SCCM AGENT' },

  { pattern: /esqueci.*senha|senha.*esquecida|esqueceu.*senha|nao.*lembro.*senha|bloqueio.*conta|conta.*bloqueada|desbloquear.*conta|desbloqueio/,  service: 'WINDOWS PASSWORD RESET AND UNLOCK' },
  { pattern: /reset.*senha|senha.*reset|redefinir.*senha|trocar.*senha/,                               service: 'WINDOWS PASSWORD RESET AND UNLOCK' },
  { pattern: /mfa|autenticac|dois.*fator|fator.*duplo|verificacao.*dois|2fa|authenticator/,            service: 'MULTIFACTORAUTHENTICATION' },
  { pattern: /oneidm|roles.*acesso|idm.*expert|idm2bcd/,                                               service: 'ONEIDM - SUPPORT' },
  { pattern: /usuario.*externo|external.*collab|acesso.*externo.*usuario|ecu/,                         service: 'EXTERNAL COLLABORATION USER' },
  { pattern: /criar.*usuario|novo.*usuario|alterar.*usuario|deletar.*usuario|owner.*conta|conta.*owner/,  service: 'IDENTITIES (USERS) NEW / CHANGE' },
  { pattern: /keepass|gerenciador.*senha|senha.*keepass/,                                              service: 'KEEPASS' },

  { pattern: /excel|planilha/,                                                                       service: 'MS EXCEL' },
  { pattern: /powerpoint|apresentacao|pptx/,                                                         service: 'MS POWERPOINT' },
  { pattern: /microsoft project|\bproject\b.*microsoft|ms project/,                                  service: 'MS PROJECT ONLINE DESKTOP CLIENT' },
  { pattern: /teams|microsoft teams|reuniao.*online|videochamada|conferencia.*microsoft/,            service: 'MICROSOFT TEAMS' },
  { pattern: /power bi|powerbi|dashboard.*power|relatorio.*power|dataset/,                           service: 'MICROSOFT POWER BI' },
  { pattern: /fabric|onelake|data.*lake.*microsoft/,                                                 service: 'MICROSOFT FABRIC' },
  { pattern: /m365|microsoft 365|office 365|o365|licenca.*office|office.*geral|365.*core/,           service: 'MICROSOFT 365 CORE' },
  { pattern: /\bword\b/,                                                                             service: 'MICROSOFT 365 CORE' },
  { pattern: /licenca.*m365|m365.*licenca|license.*management/,                                      service: 'LICENSE MANAGEMENT BD' },

  { pattern: /toner|troca.*toner|suprimento.*impressora/,                                              service: 'MY PRINTER - LOCAL SUPPORT |WORLD' },
  { pattern: /reparo.*impressora|impressora.*quebrada|peca.*impressora|lexmark|hp.*impressora/,        service: 'MY PRINTER - DEVICE REPAIR (MPS) |WORLD' },
  { pattern: /gerenciar.*impressora|administrar.*impressora|job.*impressao|oms/,                       service: 'OMS' },
  { pattern: /impressora.*cloud|cloud.*print|driver.*impressora|instalar.*impressora|conexao.*impressora/,  service: 'CLOUD-PRINTING' },
  { pattern: /impressora/,                                                                             service: 'CLOUD-PRINTING' },

  { pattern: /reparo.*computador|computador.*quebrado|defeito.*hardware|bateria.*defeito|notebook.*quebrado|laptop.*quebrado/,  service: 'MY COMPUTER - DEVICE REPAIR' },
  { pattern: /formatar|formata|firewall.*windows|configurar.*computador|suporte.*local.*pc|suporte.*pc/,  service: 'MY COMPUTER - LOCAL SUPPORT |WORLD' },
  { pattern: /informac.*computador|dados.*maquina|checar.*pc|consultar.*equipamento/,                  service: 'MY COMPUTER - CONSULTATION |WORLD' },
  { pattern: /notebook|laptop|computador|maquina.*trabalho|pc.*empresa/,                                 service: 'MY COMPUTER - LOCAL SUPPORT |WORLD' },

  { pattern: /celular.*pessoal|pessoal.*celular|mobile.*workplace.*lite|my.*workplace.*app/,               service: 'MOBILE WORKPLACE LITE' },
  { pattern: /celular.*corporativo|corporativo.*celular|roaming|chip|linha.*celular|mobile.*pim|numero.*celular/,  service: 'MOBILE PIM' },
  { pattern: /celular|smartphone|telefone.*celular/,                                                   service: 'MOBILE PIM' },

  { pattern: /vpn|corason|acesso.*remoto.*vpn|conexao.*vpn|cisco.*anyconnect/,                         service: 'CORASON' },
  { pattern: /wifi|wi.fi|wireless.*corporativo|rede.*sem.*fio/,                                              service: 'WIFI CLIENT SERVICE' },
  { pattern: /ip.*fixo|configurar.*ip|endereco.*ip|criar.*ip/,                                         service: 'LOCAL LAN SUPPORT |AM' },
  { pattern: /infra.*rede|rede.*corporativa|lan.*infra|network.*corp/,                                 service: 'LAN INFRASTRUCTURE SERVICE' },
  { pattern: /site.*bloqueado|acesso.*site|liberacao.*proxy|proxy|site.*interno.*acesso/,                service: 'INTERNET WEB ACCESS' },
  { pattern: /internet.*acesso|acesso.*internet|\binternet\b/,                                         service: 'INTERNET WEB ACCESS' },

  { pattern: /sharepoint.*externo|acesso.*externo.*share|inside.*share/,                               service: 'INSIDE.SHARE EXTERNAL' },
  { pattern: /sharepoint|share.*point|onedrive/,                                                       service: 'SHAREPOINT ONLINE' },

  { pattern: /pasta.*rede|mapear.*drive|drive.*mapear|acesso.*pasta|recuperar.*pasta|file.*share|dfs/, service: 'FILE SHARE AND DFS SERVICES AM' },

  { pattern: /lista.*distribuicao|distribution.*group|grupo.*email.*ad|grupo.*seguranca.*ad/,          service: 'ACTIVE DIRECTORY GROUP MANAGEMENT |BR' },
  { pattern: /migrar.*grupo.*ad|grupo.*nao.*gerido/,                                                   service: 'MIGRATE UNMANAGED ACTIVE DIRECTORY GROUPS TO ITSP' },

  { pattern: /maquina.*virtual|virtual.*machine|\bvm\b|citrix.*app|virtual.*workplace/,                service: 'VIRTUAL WORKPLACE' },
  { pattern: /citrix/,                                                                                 service: 'CITRIX WORKSPACE' },
  { pattern: /acesso.*rsa|remote.*shopfloor|shopfloor/,                                                service: 'REMOTE SHOPFLOOR ACCESS - ONBOARDING CONSULTANCY |WORLD' },

  { pattern: /bitlocker|criptografia.*disco|chave.*recuperacao.*disco/,                                service: 'BITLOCKER' },
  { pattern: /alto.*risco|conta.*risco|bloqueio.*microsoft.*seguranca/,                                service: 'ISY-VST OTRS SUPPORT CERT-INSTANCE' },

  { pattern: /sql.*server|banco.*dados.*sql|database.*sql|ms.*sql/,                                    service: 'MS SQL DATABASE' },

  { pattern: /adobe|acrobat|pdf.*assinatura|assinar.*pdf/,                                             service: 'ADOBE ACROBAT STANDARD+PROFESSIONAL' },
  { pattern: /docusign|assinatura.*digital.*external|digital.*signature/,                              service: 'DIGITAL SIGNATURE WORKFLOW FOR EXTERNALS' },

  { pattern: /itsp.*formulario|formulario.*itsp|nao.*encontro.*formulario|nao.*acho.*formulario/,      service: 'ITSP-10-CANNOT FIND OR SUBMIT SERVICE REQUEST' },
  { pattern: /status.*requisicao|requisicao.*status|ritm/,                                             service: 'ITSP-20-ORDER STATUS AND DELIVERY' },
  { pattern: /aprovacao.*ticket|ticket.*aprovacao|alterar.*aprovador/,                                 service: 'ITSP-30-APPROVAL AND REJECTION ISSUES' },
  { pattern: /erro.*itsp|falha.*itsp|plataforma.*itsp/,                                                service: 'ITSP-40-TECHNICAL PLATFORM ISSUE' },
  { pattern: /\bitsp\b/,                                                                               service: 'ITSP-50-OTHER' },

  { pattern: /track.*release|track.*and.*release|deploy.*projeto|falha.*deploy/,                       service: 'TRACK AND RELEASE' },
  { pattern: /docupedia/,                                                                              service: 'DOCUPEDIA' },

  { pattern: /workon|work.*on|workflow/,                                                               service: 'WORKON' },
  { pattern: /ecomex|comercio.*exterior/,                                                              service: 'ECOMEX-USERS' },
  { pattern: /eforms|assinatura.*eforms|desin.*kit/,                                                   service: 'EFORMS' },
  { pattern: /eplan|software.*engenharia.*eletrica/,                                                   service: 'EPLAN ELECTRIC' },
  { pattern: /avaya|telefonia.*corporativa|telefone.*fixo/,                                            service: 'AVAYA SERVICE TOOLS' },
  { pattern: /treinamento.*portal|portal.*treinamento|learning.*portal|hrglobal/,                      service: 'HRGLOBAL-LEARNING' },
  { pattern: /pig.*sistema|sistema.*pig|pig.*sap|pig.*sinc/,                                           service: 'PIG_AA_SF_SR' },
  { pattern: /wcms|first.*spirit|cms.*interno/,                                                          service: 'WCMS INTERNET' },
  { pattern: /windows.*server|servidor.*windows/,                                                      service: 'WINDOWS SERVER SERVICE' },
  { pattern: /igel|thin.*client/,                                                                      service: 'IGEL' },
  { pattern: /arduino/,                                                                                service: 'ARDUINO IDE' },
  { pattern: /autodesk|licenca.*cad|cad.*licenca/,                                                     service: 'AUTODESK LICENSE' },
  { pattern: /etas.*licenca|licenca.*etas/,                                                            service: 'ETAS BDC SERVICES' },
  { pattern: /ibc.*device|computador.*ibc|internet.*client.*corp/,                                    service: 'INTUNE WINDOWS INTERNET CLIENT' },
  { pattern: /\bzip\b|compactar|extrair.*arquivo|7-zip|7zip/,                                          service: '7-ZIP' },
];

function norm(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function calcularDistancia(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matriz = [];
  for (let i = 0; i <= b.length; i++) matriz[i] = [i];
  for (let j = 0; j <= a.length; j++) matriz[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matriz[i][j] = matriz[i - 1][j - 1];
      } else {
        matriz[i][j] = Math.min(
          matriz[i - 1][j - 1] + 1,
          matriz[i][j - 1] + 1,
          matriz[i - 1][j] + 1
        );
      }
    }
  }
  return matriz[b.length][a.length];
}

function isFuzzyMatch(userInput, keyword) {
  const userWords = userInput.split(/\s+/);
  const keyWords = keyword.split(/\s+/);
  
  if (keyWords.length > userWords.length) return false;

  let matchCount = 0;
  for (const kw of keyWords) {
    if (kw.length <= 4) {
      if (userWords.includes(kw)) matchCount++;
    } else if (kw.length === 5) {
      if (userWords.some(uw => calcularDistancia(kw, uw) <= 1)) matchCount++;
    } else {
      if (userWords.some(uw => calcularDistancia(kw, uw) <= 2)) matchCount++;
    }
  }
  return matchCount === keyWords.length;
}

function localLookup(text) {
  const t = norm(text);
  let melhoresResultados = {};

  for (const rule of CONTEXT_RULES) {
    if (rule.pattern.test(t)) {
      melhoresResultados[rule.service] = (melhoresResultados[rule.service] || 0) + 10;
    }
  }

  for (const [kw, sname] of Object.entries(dbDaApi.keywords)) {
    const kwn = norm(kw);
    const re = new RegExp('(^|\\s)' + kwn.replace(/[-[\]/{}()*+?.\\^$|]/g,'\\$&') + '(\\s|$)');
    
    if (re.test(t) || t.includes(kwn)) {
      melhoresResultados[sname] = (melhoresResultados[sname] || 0) + 5;
    } else if (isFuzzyMatch(t, kwn)) {
      melhoresResultados[sname] = (melhoresResultados[sname] || 0) + 2;
    }
  }

  for (const [sname] of Object.entries(dbDaApi.services)) {
    const sn = norm(sname);
    if (t.includes(sn)) {
      melhoresResultados[sname] = (melhoresResultados[sname] || 0) + 3;
    }
  }

  let servicoVencedor = null;
  let maiorPontuacao = 0;

  for (const [servico, pontuacao] of Object.entries(melhoresResultados)) {
    if (pontuacao > maiorPontuacao) {
      maiorPontuacao = pontuacao;
      servicoVencedor = servico;
    }
  }

  if (servicoVencedor && maiorPontuacao >= 2) {
    return servicoVencedor;
  }
  return null;
}

function buildCard(serviceName) {
  const s = dbDaApi.services[serviceName];
  if (!s) return '';
  const pfBadge = (s.pode_fechar || '').toUpperCase() === 'SIM'
    ? `<span class="badge badge-sim">SIM</span>`
    : `<span class="badge badge-nao">NÃO</span>`;
  return `<div class="scard">
    <div class="scard-title">Service Identificado</div>
    <div class="scard-row"><span class="scard-label">Serviço:</span><span class="scard-val">${esc(serviceName)}</span></div>
    <div class="scard-row"><span class="scard-label">Time:</span><span class="scard-val">${esc(s.time)}</span></div>
    <div class="scard-row"><span class="scard-label">Plataforma:</span><span class="scard-val">${esc(s.plataforma)}</span></div>
    <div class="scard-row"><span class="scard-label">Pode Fechar N1:</span><span class="scard-val">${pfBadge}</span></div>
    <div class="scard-row"><span class="scard-label">Descrição:</span><span class="scard-val">${esc(s.descricao)}</span></div>
    <div class="scard-row"><span class="scard-label">Exemplos:</span><span class="scard-val">${esc(s.exemplos)}</span></div>
  </div>`;
}

function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function fmtText(s) {
  return esc(s).replace(/\n/g,'<br>');
}

let history = [];

function addMsg(role, html) {
  const chat = document.getElementById('chat');
  const row = document.createElement('div');
  row.className = `row ${role}`;
  if (role === 'bot') {
    row.innerHTML = `<div class="avatar">IT</div><div class="bubble">${html}</div>`;
  } else {
    row.innerHTML = `<div class="bubble">${html}</div>`;
  }
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}

function showTyping() {
  const chat = document.getElementById('chat');
  const row = document.createElement('div');
  row.id = 'typing';
  row.className = 'row bot';
  row.innerHTML = `<div class="avatar">IT</div><div class="typing"><div class="tdot"></div><div class="tdot"></div><div class="tdot"></div></div>`;
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}
function hideTyping() {
  const el = document.getElementById('typing');
  if (el) el.remove();
}

function addChips(chips) {
  const chat = document.getElementById('chat');
  const row = document.createElement('div');
  row.className = 'row bot';
  const html = `<div class="avatar">IT</div><div class="bubble"><div class="chips">${
    chips.map(c => `<button class="chip" onclick="chipClick(this)">${esc(c)}</button>`).join('')
  }</div></div>`;
  row.innerHTML = html;
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}

function chipClick(btn) {
  document.getElementById('inp').value = btn.textContent;
  send();
}

function addFeedback(query, service) {
  const chat = document.getElementById('chat');
  const row = document.createElement('div');
  row.className = 'row bot feedback-row';
  row.innerHTML = `
    <div class="avatar">IT</div>
    <div class="bubble feedback-bubble">
      <span class="feedback-label">Essa resposta foi útil?</span>
      <div class="feedback-btns">
        <button class="feedback-btn feedback-yes" onclick="registrarFeedback(this, '${CSS.escape(query)}', '${CSS.escape(service)}', true)" title="Sim, ajudou">
          <span class="material-symbols-outlined">thumb_up</span>
        </button>
        <button class="feedback-btn feedback-no" onclick="registrarFeedback(this, '${CSS.escape(query)}', '${CSS.escape(service)}', false)" title="Não ajudou">
          <span class="material-symbols-outlined">thumb_down</span>
        </button>
      </div>
    </div>`;
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}

function registrarFeedback(btn, query, service, positive) {
  Analytics.trackFeedback(query, service, positive);
  const bubble = btn.closest('.feedback-bubble');
  bubble.innerHTML = positive
    ? `<span class="feedback-thanks feedback-thanks-yes"><span class="material-symbols-outlined">check_circle</span> Obrigado pelo feedback!</span>`
    : `<span class="feedback-thanks feedback-thanks-no"><span class="material-symbols-outlined">info</span> Feedback registado. Vamos melhorar!</span>`;
}

async function send() {
  const inp = document.getElementById('inp');
  const sbtn = document.getElementById('sbtn');
  const text = inp.value.trim();
  if (!text) return;

  inp.value = ''; inp.style.height = '';
  sbtn.disabled = true;
  addMsg('user', fmtText(text));
  history.push({ role:'user', content: text });

  const local = localLookup(text);
  if (local && dbDaApi.services[local]) {
    const categoria = dbDaApi.services[local].categoria || local;
    Analytics.track(text, true, categoria);
    history.push({ role:'assistant', content:`Service identificado: ${local}` });
    addMsg('bot', `Serviço identificado com base na sua descrição:${buildCard(local)}`);
    addFeedback(text, local);
    sbtn.disabled = false;
    inp.focus();
    return;
  }

  showTyping();
  
  setTimeout(() => {
    hideTyping();
    
    const reply = "⚠️ Serviço não encontrado.\n\nNão consegui identificar um serviço correspondente à sua solicitação na nossa base de dados.\n\nPor favor, verifique se a escrita está correta ou utilize o painel de configurações (⚙️) no canto superior direito para cadastrar este novo serviço/palavra-chave.";
    
    Analytics.track(text, false, null);
    Analytics.trackGap(text);
    history.push({ role:'assistant', content: reply });
    addMsg('bot', fmtText(reply));
    
    sbtn.disabled = false;
    inp.focus();
  }, 800); 
}

function boot() {
  addMsg('bot', 'Olá! Sou o Mike, seu assistente de suporte. Descreva seu problema, sistema ou serviço com o máximo de detalhe possível para que eu possa identificar a solicitação e retornar as informações do service relacionado.');
  addChips(['Problema no Teams','Erro no Outlook','VPN não conecta','Impressora com problema','Reset de senha','Problema no SAP']);
}

window.onload = () => {
  boot();
  const inp = document.getElementById('inp');
  inp.addEventListener('input', () => {
    inp.style.height = 'auto';
    inp.style.height = Math.min(inp.scrollHeight, 120) + 'px';
  });
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
};

async function carregarDadosDaAPI() {
    try {
       const resposta = await fetch("/dados");
        dbDaApi = await resposta.json();
        console.log("✅ Dados carregados da API com sucesso!", dbDaApi);
    } catch (erro) {
        console.error("❌ Erro ao conectar com o Python:", erro);
        console.warn("⚠️ Não foi possível carregar os dados da API. Verifique se o servidor está rodando.");
    }
}
carregarDadosDaAPI();

document.getElementById('btn-clear').addEventListener('click', clearChat)
document.getElementById('sbtn').addEventListener('click', send);

const modal = document.getElementById('modal-admin');
const menuGerenciar = document.getElementById('menu-gerenciar');
const telaFormulario = document.getElementById('tela-formulario');
const telaRemover = document.getElementById('tela-remover');
const modalTitulo = document.getElementById('modal-titulo');

document.getElementById('btn-engrenagem').addEventListener('click', () => {
    modal.style.display = 'block';
    voltarMenu();
});
document.getElementById('fechar-modal').addEventListener('click', () => {
    modal.style.display = 'none';
});

document.getElementById('btn-menu-add').addEventListener('click', () => abrirTela('adicionar'));
document.getElementById('btn-menu-alt').addEventListener('click', () => abrirTela('alterar'));
document.getElementById('btn-menu-rem').addEventListener('click', () => abrirTela('remover'));
document.getElementById('btn-voltar-1').addEventListener('click', voltarMenu);
document.getElementById('btn-voltar-2').addEventListener('click', voltarMenu);

function voltarMenu() {
    menuGerenciar.style.display = 'flex';
    telaFormulario.style.display = 'none';
    telaRemover.style.display = 'none';
    modalTitulo.innerHTML = "<span class='material-symbols-outlined'>settings</span> Gerenciar Serviços";
}

function abrirTela(acao) {
    menuGerenciar.style.display = 'none';
    limparCamposFormulario();

    if (acao === 'adicionar') {
        telaFormulario.style.display = 'block';
        document.getElementById('box-busca-alterar').style.display = 'none';
        document.getElementById('campos-formulario').style.display = 'flex';
        document.getElementById('adm-nome').readOnly = false;
        modalTitulo.innerHTML = "<span class='material-symbols-outlined'>add_circle</span> Adicionar Serviço";
    } 
    else if (acao === 'alterar') {
        telaFormulario.style.display = 'block';
        document.getElementById('box-busca-alterar').style.display = 'block';
        document.getElementById('campos-formulario').style.display = 'none';
        document.getElementById('adm-nome').readOnly = true;
        document.getElementById('busca-alterar').value = "";
        modalTitulo.innerHTML = "<span class='material-symbols-outlined'>edit</span> Alterar Serviço";
    } 
    else if (acao === 'remover') {
        telaRemover.style.display = 'block';
        document.getElementById('busca-remover').value = "";
        document.getElementById('adm-deletar-nome').value = "";
        document.getElementById('btn-deletar-servico').disabled = true;
        modalTitulo.innerHTML = "<span class='material-symbols-outlined'>delete</span> Remover Serviço";
    }
}

function limparCamposFormulario() {
    const campos = ['adm-nome', 'adm-time', 'adm-plataforma', 'adm-pode-fechar', 'adm-obs', 'adm-desc', 'adm-exemplos', 'adm-categoria', 'adm-keywords'];
    campos.forEach(id => document.getElementById(id).value = "");
}

function configurarBusca(inputId, listaId, acaoAoClicar) {
    const input = document.getElementById(inputId);
    const lista = document.getElementById(listaId);

    input.addEventListener('input', () => {
        const termo = input.value.toLowerCase();
        lista.innerHTML = "";
        
        if (!termo) {
            lista.style.display = 'none';
            return;
        }

        const resultados = Object.keys(dbDaApi.services).filter(nome => nome.toLowerCase().includes(termo));

        if (resultados.length > 0) {
            lista.style.display = 'block';
            resultados.forEach(nome => {
                const item = document.createElement('div');
                item.innerText = nome;
                item.style.cssText = "padding: 10px; cursor: pointer; border-bottom: 1px solid #444; color: white;";
                item.onmouseover = () => item.style.background = "#007bc0";
                item.onmouseout = () => item.style.background = "transparent";
                
                item.onclick = () => {
                    input.value = nome;
                    lista.style.display = 'none';
                    acaoAoClicar(nome);
                };
                lista.appendChild(item);
            });
        } else {
            lista.style.display = 'none';
        }
    });
}

configurarBusca('busca-alterar', 'lista-busca-alterar', (nomeServico) => {
    const s = dbDaApi.services[nomeServico];
    document.getElementById('adm-nome').value = nomeServico;
    document.getElementById('adm-time').value = s.time;
    document.getElementById('adm-plataforma').value = s.plataforma;
    document.getElementById('adm-pode-fechar').value = s.pode_fechar;
    document.getElementById('adm-obs').value = s.observacao;
    document.getElementById('adm-desc').value = s.descricao;
    document.getElementById('adm-exemplos').value = s.exemplos;
    document.getElementById('adm-categoria').value = s.categoria;

    const palavras = Object.keys(dbDaApi.keywords).filter(k => dbDaApi.keywords[k] === nomeServico);
    document.getElementById('adm-keywords').value = palavras.join(', ');

    document.getElementById('campos-formulario').style.display = 'flex';
});

configurarBusca('busca-remover', 'lista-busca-remover', (nomeServico) => {
    document.getElementById('adm-deletar-nome').value = nomeServico;
    document.getElementById('btn-deletar-servico').disabled = false;
});

document.getElementById('btn-salvar-servico').addEventListener('click', async () => {
    const inputKeywords = document.getElementById('adm-keywords').value;
    const palavrasArray = inputKeywords ? inputKeywords.split(',').map(p => p.trim()) : [];
    
    const novoServico = {
        nome_servico: document.getElementById('adm-nome').value.trim().toUpperCase() || "SEM NOME",
        time: document.getElementById('adm-time').value.trim() || "-",
        plataforma: document.getElementById('adm-plataforma').value.trim() || "-",
        pode_fechar: document.getElementById('adm-pode-fechar').value.trim() || "-",
        observacao: document.getElementById('adm-obs').value.trim() || "-",
        descricao: document.getElementById('adm-desc').value.trim() || "-",
        exemplos: document.getElementById('adm-exemplos').value.trim() || "-",
        categoria: document.getElementById('adm-categoria').value.trim() || "-",
        palavras_chave: palavrasArray
    };

    try {
        const resposta = await fetch("/servicos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoServico)
        });
        
        if (resposta.ok) {
            alert("💾 Serviço Salvo/Alterado com Sucesso!");
            carregarDadosDaAPI(); 
            voltarMenu();
        } else {
            alert("Erro 422: Verifique se não deixou nenhum campo vazio de forma errada.");
        }
    } catch (erro) {
        alert("Erro ao salvar. Verifique se o backend está rodando.");
    }
});

document.getElementById('btn-deletar-servico').addEventListener('click', async () => {
    const nomeDeletar = document.getElementById('adm-deletar-nome').value.toUpperCase();
    
    if (confirm(`⚠️ Tem certeza que deseja deletar permanentemente o serviço: ${nomeDeletar}?`)) {
        try {
            const resposta = await fetch(`/servicos/${nomeDeletar}`, {
                method: "DELETE"
            });
            
            if (resposta.ok) {
                alert("🗑️ Serviço Deletado!");
                carregarDadosDaAPI(); 
                voltarMenu();
            } else {
                alert("Serviço não encontrado.");
            }
        } catch (erro) {
            alert("Erro ao deletar.");
        }
    }
});

function clearChat() {
    history = [];
    document.getElementById('chat').innerHTML = '';
    boot();
}