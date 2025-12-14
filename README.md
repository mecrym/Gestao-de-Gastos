# Projeto MVP - Gestão de Pagamentos e Categorias

Este projeto foi desenvolvido como resoluçaõ da prova de estágio de desenvolvimento de software da Inatel.

A atividade proposta foi a construção de um MVP fullstack utilizando obrigatóriamente um banco de dados realacional e a linguagem Python no backend para o desenvolvimento de uma API RESTful. Fazia parte dos requisitos também, fazer o uso correto dos *status_code* e dos *métodos HTTP*, além de possuir um *CRUD* completo.

## Tema do Projeto

O tema escolhido foi um sistema simples de gestão de gastos, que seriam divididos por categorias.  
- Cada categoria pode ter vários pagamentos (relação 1:N).  
- O usuário pode criar, listar, atualizar e excluir tanto categorias quanto pagamentos.  
- Ao apagar uma categoria, todos os pagamentos realizados que fazem parte a ela também são apagados.

![Modelagem Relacional](/img-docs/Captura%20de%20tela%20de%202025-12-14%2018-48-50.png)

## Tecnologias Utilizadas

Algumas tiveram suas versões listadas pois algumas funcionalidades não funcionam em versões antigas, um exemplo é o "themes" utilizado na estilização do frontend e que não funciona na versão 3 do tailwindcss.

### Backend
- Python 3.10+
- FastAPI
- SQLAlchemy
- SQLite
- Uvicorn
- Draw.io

### Frontend
- React 18+
- Vite
- TailwindCSS 4.1.18
- Lucide React
- Axios

## Estrutura do Repositório

```
/backend  
    ├── database.py   
    ├── main.py
    └──models.py  

/frontend  
    ├── src/  
    │   ├── components/  
    │   ├── api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── package.json  
    └── vite.config.js  

```

## Instalação e Execução

### Pré-requisitos
```
- Python 3.10+
- Node.js 18+
```
### Backend (API Python)

1. Acesse a pasta do backend:
   cd backend

2. Crie e ative um ambiente virtual:
```
   python -m venv venv
   source venv/bin/activate   # Linux/Mac
   venv\Scripts\activate      # Windows
```

3. Instale as dependências:
```
   pip install -r requirements.txt
```

4. Execute o servidor:
```
   uvicorn main:app --reload
```

5. A API estará disponível em:

   http://127.0.0.1:8000

6. Documentação interativa (Swagger/OpenAPI):

   http://127.0.0.1:8000/docs

### Frontend (React)

1. Acesse a pasta do frontend:
```
   cd frontend
   ```

2. Instale as dependências:
```
   npm install
   ```

3. Execute o servidor de desenvolvimento:
```
   npm run dev
   ```

4. O frontend estará disponível em:

   http://127.0.0.1:5173

## Funcionalidades

- Categorias
  - Criar, listar, atualizar e excluir categorias.
  - Seleção de cor personalizada para cada categoria.

- Pagamentos
  - Criar, listar, atualizar e excluir pagamentos.
  - Associação obrigatória a uma categoria.
  - Exibição em lista com filtros e ordenação.
  - Gráfico em formato de donut para resumo por categoria.

- Integração
  - O frontend consome dados diretamente da API.
  - Feedback visual para operações (loading, sucesso, erro).

## Imagens do Frontend

![Frontend Screenshot](FOTO-AQ)

![Frontend Screenshot](FOTO-AQ)

![Frontend Screenshot](FOTO-AQ)

![Frontend Screenshot](FOTO-AQ)

![Frontend Screenshot](FOTO-AQ)

![Frontend Screenshot](FOTO-AQ)

