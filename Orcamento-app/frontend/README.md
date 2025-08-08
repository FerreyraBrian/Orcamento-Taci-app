# Frontend - Sistema de Orçamentação Eng. Civil

Frontend React + TypeScript profissional para sistema de orçamentação de construção civil.

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **React Router DOM** - Navegação
- **React Hook Form** - Gerenciamento de formulários
- **React Hot Toast** - Notificações
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **Axios** - Cliente HTTP

## 📁 Estrutura do Projeto

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ui/           # Componentes base (Button, Input, Select)
│   │   └── layout/       # Header e Footer
│   ├── pages/            # Páginas da aplicação
│   │   ├── HomePage.tsx  # Página inicial (tarjeta de presentación)
│   │   ├── CalculatorPage.tsx # Calculadora de orçamento
│   │   └── AdminPage.tsx # Painel administrativo
│   ├── services/
│   │   └── api.ts        # Serviços de API
│   ├── types/
│   │   └── index.ts      # Tipos TypeScript
│   ├── App.tsx           # Componente principal
│   ├── index.tsx         # Ponto de entrada
│   └── index.css         # Estilos globais
├── package.json
├── tailwind.config.js
└── README.md
```

## 🎨 Design System

### Cores
- **Primary**: Laranja (#ed7a1a) - Cor principal da marca
- **Secondary**: Cinza (#64748b) - Textos e elementos secundários
- **Accent**: Laranja claro (#f97316) - Destaques e ações

### Tipografia
- **Display**: Poppins - Títulos e headlines
- **Body**: Inter - Texto do corpo

## 📱 Páginas

### 1. HomePage (/) - Tarjeta de Presentación
- Hero section com apresentação profissional
- Seção de serviços oferecidos
- Portfólio de projetos realizados
- Estatísticas e credibilidade
- Formulário de contato
- Informações de contato

### 2. CalculatorPage (/calculator) - Calculadora
- Formulário completo de dados do projeto
- Cálculo em tempo real
- Visualização detalhada do EAP
- Exportação para CSV
- Resumo do orçamento

### 3. AdminPage (/admin) - Painel Administrativo
- Gestão de fatores de custo
- Interface administrativa completa
- Validação de formulários
- Feedback visual de alterações

## 🔧 Instalação e Execução

### Pré-requisitos
- Node.js 16+
- npm ou yarn

### Instalação
```bash
cd frontend
npm install
```

### Execução em Desenvolvimento
```bash
npm start
```

A aplicação estará disponível em: `http://localhost:3000`

### Build de Produção
```bash
npm run build
```

## 🔌 Configuração da API

O frontend está configurado para conectar com o backend Spring Boot na porta 8080.

### Variáveis de Ambiente
```env
REACT_APP_API_URL=http://localhost:8080/api
```

### Endpoints Utilizados
- `POST /api/budget/calculate` - Cálculo de orçamento
- `POST /api/export/csv` - Exportação CSV
- `GET /api/admin/cost-factors` - Obter fatores
- `PUT /api/admin/cost-factors` - Atualizar fatores

## 🎯 Funcionalidades

### ✅ Implementadas
- **Navegação responsiva** com Header e Footer
- **Formulários validados** com React Hook Form
- **Notificações toast** para feedback do usuário
- **Cálculo em tempo real** de orçamentos
- **Exportação CSV** com formatação brasileira
- **Interface administrativa** completa
- **Design responsivo** para mobile e desktop
- **Tipagem TypeScript** completa
- **Componentes reutilizáveis** com Tailwind CSS

### 🚀 Próximas Funcionalidades
- Autenticação e autorização
- Dashboard com gráficos
- Histórico de orçamentos
- Templates de projetos
- Integração com WhatsApp
- PWA (Progressive Web App)

## 📱 Responsividade

O design é totalmente responsivo e otimizado para:
- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

## 🎨 Componentes UI

### Button
```tsx
<Button variant="primary" size="md">
  Clique aqui
</Button>
```

### Input
```tsx
<Input 
  label="Nome" 
  type="text" 
  error="Campo obrigatório"
/>
```

### Select
```tsx
<Select 
  label="Tipo" 
  options={[
    { value: 'option1', label: 'Opção 1' }
  ]}
/>
```

## 🔒 Segurança

- Validação de formulários no frontend
- Sanitização de dados
- Headers de segurança configurados
- CORS configurado para comunicação segura

## 📊 Performance

- Lazy loading de componentes
- Otimização de imagens
- Bundle splitting
- Tree shaking
- Memoização de componentes

## 🧪 Testes

```bash
npm test
```

## 📦 Deploy

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload da pasta build/
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. 