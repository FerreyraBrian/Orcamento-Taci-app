# Orçamento App - Sistema de Orçamento de Construção

Sistema completo de orçamento de construção com backend Java Spring Boot e frontend React TypeScript.

## 🏗️ Arquitetura

- **Backend**: Java 17 + Spring Boot 3.2.0 + MySQL
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Banco de Dados**: MySQL (XAMPP)
- **Autenticação**: Sistema de login simples com tokens

## 🚀 Funcionalidades

### Frontend (React + TypeScript)
- **Página Inicial**: Apresentação profissional da engenheira civil
- **Calculadora**: Formulário de orçamento com cálculo em tempo real
- **Painel Admin**: Gerenciamento de fatores de custo (protegido por login)
- **Exportação CSV**: Download dos resultados em formato CSV

### Backend (Java + Spring Boot)
- **API REST**: Endpoints para cálculo, administração e autenticação
- **Cálculo de Orçamento**: Lógica baseada em EAP (13 etapas)
- **Persistência**: MySQL com JPA/Hibernate
- **Validação**: Bean Validation
- **CORS**: Configurado para frontend

## 📋 Pré-requisitos

- Java 17+
- Node.js 16+
- MySQL (XAMPP)
- Maven

## 🛠️ Instalação e Execução

### 1. Configuração do Banco de Dados

1. Inicie o XAMPP e ative o MySQL
2. Crie um banco de dados chamado `orcamento_db` (ou deixe o sistema criar automaticamente)

### 2. Backend (Java Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

O backend estará disponível em: `http://localhost:8080/api`

**Credenciais padrão do admin:**
- Usuário: `admin`
- Senha: `1234`

### 3. Frontend (React TypeScript)

```bash
cd frontend
npm install
npm start
```

O frontend estará disponível em: `http://localhost:3000`

## 🔐 Autenticação

O sistema inclui autenticação para o painel administrativo:

- **Login**: `/admin` - Página de login protegida
- **Credenciais padrão**: admin / 1234
- **Tokens**: Sistema de tokens simples em memória
- **Proteção**: Rotas administrativas protegidas

## 📊 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login do administrador
- `POST /api/auth/logout` - Logout
- `GET /api/auth/validate` - Validar token

### Orçamento
- `POST /api/budget/calculate` - Calcular orçamento
- `POST /api/export/csv` - Exportar para CSV

### Administração (Protegido)
- `GET /api/admin/cost-factors` - Obter fatores de custo
- `PUT /api/admin/cost-factors` - Atualizar fatores de custo

## 🧮 Lógica de Cálculo

O sistema utiliza uma estrutura EAP (Estrutura Analítica do Projeto) com 13 etapas:

1. **Fundação** (15%)
2. **Estrutura** (20%)
3. **Alvenaria** (8%)
4. **Acabamento** (12%)
5. **Cobertura** (10%)
6. **Esquadrias** (8%)
7. **Instalações Elétricas** (8%)
8. **Instalações Hidráulicas** (6%)
9. **Pintura** (5%)
10. **Pisos** (4%)
11. **Forros** (2%)
12. **Impermeabilização** (1%)
13. **Limpeza e Acabamento** (1%)

### Fatores Configuráveis

- **Tipos de Parede**: Alvenaria, Drywall, Steel Frame
- **Qualidade de Acabamento**: Básico, Padrão, Premium
- **Acabamento de Parede**: Pintura, Cerâmica, Pedra Natural
- **Esquadrias**: Alumínio, Madeira, PVC
- **Forros**: Gesso, Drywall, Suspenso
- **Cobertura**: Cerâmica, Metálica, Concreto
- **Fundação**: Rasa, Profunda, Estacas

## 🎨 Design System

### Cores
- **Primary**: Azul profissional (#2563EB)
- **Secondary**: Cinza neutro (#64748B)
- **Accent**: Verde sucesso (#10B981)

### Tipografia
- **Sans**: Inter
- **Display**: Poppins

## 📱 Responsividade

- Design responsivo para desktop, tablet e mobile
- Componentes adaptáveis
- Navegação otimizada para diferentes dispositivos

## 🔧 Tecnologias Utilizadas

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- MySQL Connector
- Lombok
- OpenCSV
- Bean Validation

### Frontend
- React 18
- TypeScript
- React Router DOM
- React Hook Form
- React Hot Toast
- Tailwind CSS
- Lucide React
- Axios

## 🚀 Próximas Funcionalidades

- [ ] Autenticação JWT
- [ ] Dashboard com gráficos
- [ ] Histórico de orçamentos
- [ ] Templates de projetos
- [ ] Integração com WhatsApp
- [ ] PWA (Progressive Web App)
- [ ] Cache Redis
- [ ] Monitoramento com Actuator

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido para engenheiros civis profissionais** 🏗️
