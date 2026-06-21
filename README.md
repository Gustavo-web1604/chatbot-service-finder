# Chatbot de Identificação de Serviços de TI
Um chatbot web feito com FastAPI e JavaScript para ajudar na identificação rápida de serviços de TI a partir da descrição de um problema.
Esse projeto foi construído para uso prático no dia a dia de uma equipe de suporte, e serviu como uma ótima forma de colocar em prática os fundamentos de Python, FastAPI e JavaScript no desenvolvimento de ferramentas internas.

## Funcionalidades
A aplicação roda em um servidor local e oferece uma interface de chat onde é possível:
- Descrever um problema, sistema ou serviço e receber o serviço de TI correspondente.
- Consultar detalhes do serviço identificado (time responsável, plataforma, categoria, observações).
- Cadastrar, editar e remover serviços do catálogo.
- Acompanhar o uso do chatbot por um painel de Analytics com gráficos.
- Dar feedback sobre a identificação retornada.

## Tecnologias Utilizadas
- Python / FastAPI: backend e API responsável pela lógica de identificação dos serviços.
- JavaScript (vanilla): motor de correspondência por palavras-chave e interações do chat.
- HTML / CSS: interface do chatbot.
- Chart.js: gráficos do painel de Analytics.

## Pensando no Futuro (Próximos Passos)
Essa versão web é só a primeira etapa. A lógica de identificação e o catálogo de serviços construídos aqui servem como uma base sólida para expandir o sistema. Meus planos para a evolução incluem:
1. Migrar a busca por palavras-chave para um modelo de matching semântico (NLP), reduzindo a dependência de keywords exatas.
2. Integrar com ferramentas de chat corporativo (Microsoft Teams, Slack), levando o chatbot direto para onde a equipe já trabalha.
3. Adicionar autenticação e perfis de acesso, permitindo que diferentes times gerenciem seus próprios catálogos de serviço.

---
Desenvolvido com dedicação para fins de aprendizado e evolução contínua.
