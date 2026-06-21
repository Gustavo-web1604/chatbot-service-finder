from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import json
import os

app = FastAPI(title="API Chat HSDA - Equipe")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ARQUIVO_DADOS = "dados.json"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def ler_dados():
    if not os.path.exists(ARQUIVO_DADOS):
        return {"services": {}, "keywords": {}}
    with open(ARQUIVO_DADOS, "r", encoding="utf-8") as f:
        return json.load(f)

def salvar_dados(dados):
    with open(ARQUIVO_DADOS, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=4)

class Servico(BaseModel):
    nome_servico: str
    time: str
    plataforma: str
    pode_fechar: str
    observacao: str
    descricao: str
    exemplos: str
    categoria: str
    palavras_chave: list[str]

@app.get("/dados")
def get_dados():
    return ler_dados()

@app.post("/servicos")
def salvar_servico(servico: Servico):
    dados = ler_dados()
    nome = servico.nome_servico.upper()

    dados["services"][nome] = {
        "time": servico.time,
        "plataforma": servico.plataforma,
        "pode_fechar": servico.pode_fechar,
        "observacao": servico.observacao,
        "descricao": servico.descricao,
        "exemplos": servico.exemplos,
        "categoria": servico.categoria
    }

    chaves_para_remover = [k for k, v in dados["keywords"].items() if v == nome]
    for k in chaves_para_remover:
        del dados["keywords"][k]

    for palavra in servico.palavras_chave:
        chave = palavra.lower().strip()
        if chave:
            dados["keywords"][chave] = nome

    salvar_dados(dados)
    return {"mensagem": f"Servico '{nome}' salvo com sucesso!"}

@app.delete("/servicos/{nome_servico}")
def deletar_servico(nome_servico: str):
    dados = ler_dados()
    nome = nome_servico.upper()

    if nome not in dados["services"]:
        raise HTTPException(status_code=404, detail="Servico nao encontrado.")

    del dados["services"][nome]

    chaves_para_remover = [k for k, v in dados["keywords"].items() if v == nome]
    for k in chaves_para_remover:
        del dados["keywords"][k]

    salvar_dados(dados)
    return {"mensagem": f"Servico '{nome}' deletado!"}

app.mount("/", StaticFiles(directory=os.path.join(BASE_DIR, "../front"), html=True), name="frontend")