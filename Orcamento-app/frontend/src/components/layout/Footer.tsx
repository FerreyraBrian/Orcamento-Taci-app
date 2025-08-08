import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Mail, Phone, MapPin, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold">
                Eng. Civil
              </span>
            </div>
            <p className="text-secondary-300 mb-4 max-w-md">
              Especialista em projetos de construção civil com mais de 10 anos de experiência. 
              Oferecemos soluções completas em orçamentação, planejamento e execução de obras.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2 text-secondary-300">
              <li>
                <Link to="/calculator" className="hover:text-primary-400 transition-colors">
                  Orçamentação
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Projetos Arquitetônicos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Projetos Estruturais
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Gerenciamento de Obras
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <div className="space-y-3 text-secondary-300">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary-400" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary-400" />
                <span>contato@engcivil.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5" />
                <span>São Paulo, SP<br />Brasil</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-800 mt-8 pt-8 text-center text-secondary-400">
          <p>&copy; 2024 Eng. Civil. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 