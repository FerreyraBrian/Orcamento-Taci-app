import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { 
  Calculator, 
  Download, 
  Building2, 
  Ruler, 
  PaintBucket, 
  DoorOpen, 
  Bath, 
  Home, 
  Wind, 
  Droplet, 
  Percent,
  FileText,
  DollarSign
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { BudgetInputs, BudgetResponse, EapItem, ClientData } from '../types';
import { budgetApi } from '../services/api';

const CalculatorPage: React.FC = () => {
  const [budgetResponse, setBudgetResponse] = useState<BudgetResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [clientData, setClientData] = useState<ClientData>({
    name: '',
    email: '',
    phone: ''
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<BudgetInputs>({
    defaultValues: {
      area: 100,
      wallType: 'masonry',
      finishQuality: 'medium',
      wallFinish: 'paint',
      frameArea: 15,
      bathrooms: 2,
      floorArea: 100,
      ceilingArea: 100,
      ceilingType: 'pvc',
      roofType: 'ceramic',
      roofArea: 110,
      foundationType: 'standard',
      wastePercentage: 5,
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: BudgetInputs) => {
    setIsLoading(true);
    try {
      const response = await budgetApi.calculate(data);
      setBudgetResponse(response);
      setShowClientForm(true);
      toast.success('Orçamento calculado com sucesso!');
    } catch (error) {
      console.error('Erro ao calcular orçamento:', error);
      toast.error('Erro ao calcular orçamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (!budgetResponse || !clientData.name || !clientData.email) {
      toast.error('Por favor, preencha todos os dados obrigatórios.');
      return;
    }

    setIsLoading(true);
    try {
      const requestData = {
        ...watchedValues,
        clientData
      };
      
      await budgetApi.submit(requestData);
      toast.success('Pedido enviado com sucesso! Em breve entraremos em contato.');
      setShowClientForm(false);
      setClientData({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      toast.error('Erro ao enviar pedido. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCsv = async () => {
    if (!budgetResponse) return;
    
    try {
      const blob = await budgetApi.exportCsv(watchedValues);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'orcamento.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Arquivo CSV exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      toast.error('Erro ao exportar CSV. Tente novamente.');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const wallTypeOptions = [
    { value: 'masonry', label: 'Alvenaria' },
    { value: 'structural', label: 'Alvenaria Estrutural' },
    { value: 'drywall', label: 'Drywall' },
  ];

  const finishQualityOptions = [
    { value: 'economy', label: 'Econômico' },
    { value: 'medium', label: 'Médio' },
    { value: 'high', label: 'Alto' },
  ];

  const wallFinishOptions = [
    { value: 'paint', label: 'Pintura' },
    { value: 'cladding', label: 'Chapisco' },
    { value: 'plaster', label: 'Emboço' },
    { value: 'skim-coat', label: 'Reboco' },
  ];

  const ceilingTypeOptions = [
    { value: 'pvc', label: 'PVC' },
    { value: 'gypsum', label: 'Gesso' },
  ];

  const roofTypeOptions = [
    { value: 'ceramic', label: 'Cerâmica' },
    { value: 'metal', label: 'Metálica' },
    { value: 'slab', label: 'Laje' },
  ];

  const foundationTypeOptions = [
    { value: 'standard', label: 'Padrão' },
    { value: 'continuous-helix', label: 'Hélice Contínua' },
  ];

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold text-secondary-900">
              Calculadora de Orçamento
            </h1>
          </div>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Preencha os dados do seu projeto para obter um orçamento detalhado e preciso.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-secondary-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Dados do Projeto
              </h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Área Total */}
                <Input
                  label="Área Total (m²)"
                  type="number"
                  {...register('area', { 
                    required: 'Área é obrigatória',
                    min: { value: 10, message: 'Mínimo 10m²' }
                  })}
                  error={errors.area?.message}
                  icon={<Ruler className="w-4 h-4" />}
                />

                {/* Tipo de Parede */}
                <Select
                  label="Tipo de Parede"
                  options={wallTypeOptions}
                  {...register('wallType', { required: 'Tipo de parede é obrigatório' })}
                  error={errors.wallType?.message}
                />

                {/* Padrão de Acabamento */}
                <Select
                  label="Padrão de Acabamento"
                  options={finishQualityOptions}
                  {...register('finishQuality', { required: 'Padrão de acabamento é obrigatório' })}
                  error={errors.finishQuality?.message}
                />

                {/* Acabamento das Paredes */}
                <Select
                  label="Acabamento das Paredes"
                  options={wallFinishOptions}
                  {...register('wallFinish', { required: 'Acabamento das paredes é obrigatório' })}
                  error={errors.wallFinish?.message}
                />

                {/* Área de Esquadrias */}
                <Input
                  label="Área de Esquadrias (m²)"
                  type="number"
                  {...register('frameArea', { 
                    required: 'Área de esquadrias é obrigatória',
                    min: { value: 0, message: 'Mínimo 0m²' }
                  })}
                  error={errors.frameArea?.message}
                  icon={<DoorOpen className="w-4 h-4" />}
                />

                {/* Quantidade de Banheiros */}
                <Input
                  label="Quantidade de Banheiros"
                  type="number"
                  {...register('bathrooms', { 
                    required: 'Quantidade de banheiros é obrigatória',
                    min: { value: 0, message: 'Mínimo 0' }
                  })}
                  error={errors.bathrooms?.message}
                  icon={<Bath className="w-4 h-4" />}
                />

                {/* Área de Piso */}
                <Input
                  label="Área de Piso (m²)"
                  type="number"
                  {...register('floorArea', { 
                    required: 'Área de piso é obrigatória',
                    min: { value: 0, message: 'Mínimo 0m²' }
                  })}
                  error={errors.floorArea?.message}
                  icon={<Home className="w-4 h-4" />}
                />

                {/* Área de Forro */}
                <Input
                  label="Área de Forro (m²)"
                  type="number"
                  {...register('ceilingArea', { 
                    required: 'Área de forro é obrigatória',
                    min: { value: 0, message: 'Mínimo 0m²' }
                  })}
                  error={errors.ceilingArea?.message}
                  icon={<Wind className="w-4 h-4" />}
                />

                {/* Tipo de Forro */}
                <Select
                  label="Tipo de Forro"
                  options={ceilingTypeOptions}
                  {...register('ceilingType', { required: 'Tipo de forro é obrigatório' })}
                  error={errors.ceilingType?.message}
                />

                {/* Área de Cobertura */}
                <Input
                  label="Área de Cobertura (m²)"
                  type="number"
                  {...register('roofArea', { 
                    required: 'Área de cobertura é obrigatória',
                    min: { value: 0, message: 'Mínimo 0m²' }
                  })}
                  error={errors.roofArea?.message}
                  icon={<Building2 className="w-4 h-4" />}
                />

                {/* Tipo de Cobertura */}
                <Select
                  label="Tipo de Cobertura"
                  options={roofTypeOptions}
                  {...register('roofType', { required: 'Tipo de cobertura é obrigatório' })}
                  error={errors.roofType?.message}
                />

                {/* Tipo de Fundação */}
                <Select
                  label="Tipo de Fundação"
                  options={foundationTypeOptions}
                  {...register('foundationType', { required: 'Tipo de fundação é obrigatório' })}
                  error={errors.foundationType?.message}
                />

                {/* Percentual de Desperdício */}
                <Input
                  label="Percentual de Desperdício (%)"
                  type="number"
                  {...register('wastePercentage', { 
                    required: 'Percentual de desperdício é obrigatório',
                    min: { value: 0, message: 'Mínimo 0%' },
                    max: { value: 100, message: 'Máximo 100%' }
                  })}
                  error={errors.wastePercentage?.message}
                  icon={<Percent className="w-4 h-4" />}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Calculando...' : 'Calcular Orçamento'}
                </Button>
              </form>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {budgetResponse ? (
              <div className="space-y-6">
                {/* Summary Card */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-secondary-900 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Resumo do Orçamento
                    </h2>
                    <Button onClick={handleExportCsv} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar CSV
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-primary-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-primary-600">
                        {formatCurrency(budgetResponse.total)}
                      </div>
                      <div className="text-sm text-primary-700">Total do Orçamento</div>
                    </div>
                    <div className="bg-secondary-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-secondary-600">
                        {watchedValues.area}m²
                      </div>
                      <div className="text-sm text-secondary-700">Área do Projeto</div>
                    </div>
                    <div className="bg-accent-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-accent-600">
                        {formatCurrency(budgetResponse.total / watchedValues.area)}
                      </div>
                      <div className="text-sm text-accent-700">Custo por m²</div>
                    </div>
                  </div>
                </div>

                {/* EAP Details */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                    Detalhamento EAP
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-secondary-200">
                          <th className="text-left py-3 px-4 font-semibold text-secondary-700">Item</th>
                          <th className="text-right py-3 px-4 font-semibold text-secondary-700">Preço Unitário</th>
                          <th className="text-right py-3 px-4 font-semibold text-secondary-700">Preço Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {budgetResponse.eap.map((item: EapItem) => (
                          <tr key={item.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                            <td className="py-3 px-4 font-medium text-secondary-900">
                              {item.name}
                            </td>
                            <td className="py-3 px-4 text-right text-secondary-600">
                              {formatCurrency(item.unitPrice)}
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-secondary-900">
                              {formatCurrency(item.totalPrice)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-secondary-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  Aguardando dados do projeto
                </h3>
                <p className="text-secondary-600">
                  Preencha o formulário ao lado para calcular o orçamento do seu projeto.
                </p>
              </div>
            )}

            {/* Client Data Form */}
            {showClientForm && budgetResponse && (
              <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  Dados do Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Nome Completo *"
                    type="text"
                    value={clientData.name}
                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                    placeholder="Digite seu nome completo"
                  />
                  <Input
                    label="E-mail *"
                    type="email"
                    value={clientData.email}
                    onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                    placeholder="Digite seu e-mail"
                  />
                  <Input
                    label="Telefone"
                    type="tel"
                    value={clientData.phone}
                    onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                    placeholder="Digite seu telefone"
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowClientForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSubmitRequest}
                    disabled={isLoading || !clientData.name || !clientData.email}
                  >
                    {isLoading ? 'Enviando...' : 'Enviar Pedido'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage; 