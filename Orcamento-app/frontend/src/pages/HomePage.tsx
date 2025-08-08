import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  Building2, 
  Ruler, 
  CheckCircle, 
  Star, 
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Service, Project } from '../types';

const HomePage: React.FC = () => {
  const services: Service[] = [
    {
      id: '1',
      title: 'Orçamentação Detalhada',
      description: 'Cálculos precisos de custos para projetos de construção com análise EAP completa.',
      icon: 'Calculator',
      features: ['Análise EAP', 'Custos por m²', 'Relatórios detalhados', 'Exportação CSV']
    },
    {
      id: '2',
      title: 'Projetos Arquitetônicos',
      description: 'Desenvolvimento de projetos arquitetônicos residenciais e comerciais.',
      icon: 'Building2',
      features: ['Plantas baixas', 'Cortes e elevações', 'Detalhamentos', '3D visualization']
    },
    {
      id: '3',
      title: 'Projetos Estruturais',
      description: 'Cálculos estruturais e dimensionamento de elementos construtivos.',
      icon: 'Ruler',
      features: ['Cálculos estruturais', 'Dimensionamento', 'Memoriais', 'Laudos técnicos']
    }
  ];

  const projects: Project[] = [
    {
      id: '1',
      title: 'Residencial Solar',
      description: 'Casa moderna de 180m² com sistema solar integrado',
      image: '/api/placeholder/400/300',
      category: 'Residencial',
      area: 180,
      completionDate: '2023'
    },
    {
      id: '2',
      title: 'Edifício Comercial',
      description: 'Complexo comercial de 3 andares com 800m²',
      image: '/api/placeholder/400/300',
      category: 'Comercial',
      area: 800,
      completionDate: '2023'
    },
    {
      id: '3',
      title: 'Reforma Industrial',
      description: 'Reforma completa de galpão industrial de 1200m²',
      image: '/api/placeholder/400/300',
      category: 'Industrial',
      area: 1200,
      completionDate: '2022'
    }
  ];

  const stats = [
    { label: 'Projetos Concluídos', value: '150+' },
    { label: 'Anos de Experiência', value: '10+' },
    { label: 'Clientes Satisfeitos', value: '200+' },
    { label: 'Área Total Projetada', value: '50.000m²' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-accent-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-secondary-900 mb-6">
                Engenharia Civil
                <span className="text-primary-600 block">Profissional</span>
              </h1>
              <p className="text-xl text-secondary-600 mb-8 max-w-lg">
                Especialista em projetos de construção civil com mais de 10 anos de experiência. 
                Oferecemos soluções completas em orçamentação, planejamento e execução de obras.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link to="/calculator">
                    Solicitar Orçamento
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="#contact">
                    Fale Conosco
                    <Phone className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900">
                      Calculadora de Orçamento
                    </h3>
                    <p className="text-secondary-600">Cálculo preciso em tempo real</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                    <span className="text-secondary-600">Área do Projeto</span>
                    <span className="font-semibold text-secondary-900">100m²</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                    <span className="text-secondary-600">Tipo de Construção</span>
                    <span className="font-semibold text-secondary-900">Residencial</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg">
                    <span className="text-primary-700 font-semibold">Orçamento Estimado</span>
                    <span className="text-primary-700 font-bold text-lg">R$ 180.000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-secondary-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-4">
              Nossos Serviços
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Oferecemos soluções completas em engenharia civil, desde o planejamento até a execução.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                  <Calculator className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-secondary-600 mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-secondary-600">
                      <CheckCircle className="w-4 h-4 text-primary-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-4">
              Projetos Realizados
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Conheça alguns dos nossos projetos mais recentes e bem-sucedidos.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                  <Building2 className="w-16 h-16 text-primary-600" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                    <span className="text-sm text-secondary-500">
                      {project.completionDate}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-secondary-600 mb-4">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-500">
                      Área: {project.area}m²
                    </span>
                    <Button variant="ghost" size="sm">
                      Ver Detalhes
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Entre em Contato
              </h2>
              <p className="text-xl text-secondary-300 mb-8">
                Estamos prontos para transformar seu projeto em realidade. 
                Entre em contato conosco para uma consulta gratuita.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary-400" />
                  <span className="text-secondary-300">(11) 99999-9999</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary-400" />
                  <span className="text-secondary-300">contato@engcivil.com</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary-400 mt-0.5" />
                  <span className="text-secondary-300">
                    São Paulo, SP<br />
                    Brasil
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8">
              <h3 className="text-2xl font-semibold text-secondary-900 mb-6">
                Solicite um Orçamento
              </h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Nome completo"
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Telefone"
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Descreva seu projeto"
                  rows={4}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                ></textarea>
                <Button className="w-full">
                  Enviar Mensagem
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 