import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { adminApi } from '../services/api';
import { CostFactors } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Settings, Save, LogOut, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPage: React.FC = () => {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<CostFactors | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<CostFactors>();

  // Watch for changes
  const watchedValues = watch();

  useEffect(() => {
    loadCostFactors();
  }, []);

  useEffect(() => {
    if (originalData) {
      const hasAnyChanges = Object.keys(watchedValues).some(
        key => watchedValues[key as keyof CostFactors] !== originalData[key as keyof CostFactors]
      );
      setHasChanges(hasAnyChanges);
    }
  }, [watchedValues, originalData]);

  const loadCostFactors = async () => {
    try {
      const factors = await adminApi.getCostFactors();
      reset(factors);
      setOriginalData(factors);
    } catch (error) {
      toast.error('Failed to load cost factors');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CostFactors) => {
    setIsSaving(true);
    try {
      await adminApi.updateCostFactors(data);
      setOriginalData(data);
      setHasChanges(false);
      toast.success('Cost factors updated successfully!');
    } catch (error) {
      toast.error('Failed to update cost factors');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Settings className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage cost factors and system settings</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Cost Factors Configuration</h2>
            <p className="text-sm text-gray-600 mt-1">
              Adjust the multipliers and costs used in budget calculations
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            {hasChanges && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <p className="text-sm text-yellow-800">
                    You have unsaved changes. Please save your changes before leaving.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Wall Type Multipliers */}
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900 border-b pb-2">Wall Type Multipliers</h3>
                
                <Input
                  label="Alvenaria Multiplier"
                  type="number"
                  step="0.01"
                  error={errors.alvenariaMultiplier?.message}
                  {...register('alvenariaMultiplier', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />

                <Input
                  label="Drywall Multiplier"
                  type="number"
                  step="0.01"
                  error={errors.drywallMultiplier?.message}
                  {...register('drywallMultiplier', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />

                <Input
                  label="Steel Frame Multiplier"
                  type="number"
                  step="0.01"
                  error={errors.steelFrameMultiplier?.message}
                  {...register('steelFrameMultiplier', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />
              </div>

              {/* Finish Quality Multipliers */}
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900 border-b pb-2">Finish Quality Multipliers</h3>
                
                <Input
                  label="Basic Finish Multiplier"
                  type="number"
                  step="0.01"
                  error={errors.basicFinishMultiplier?.message}
                  {...register('basicFinishMultiplier', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />

                <Input
                  label="Standard Finish Multiplier"
                  type="number"
                  step="0.01"
                  error={errors.standardFinishMultiplier?.message}
                  {...register('standardFinishMultiplier', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />

                <Input
                  label="Premium Finish Multiplier"
                  type="number"
                  step="0.01"
                  error={errors.premiumFinishMultiplier?.message}
                  {...register('premiumFinishMultiplier', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />
              </div>

              {/* Wall Finish Multipliers */}
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900 border-b pb-2">Wall Finish Multipliers</h3>
                
                <Input
                  label="Paint Multiplier"
                  type="number"
                  step="0.01"
                  error={errors.paintMultiplier?.message}
                  {...register('paintMultiplier', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />

                <Input
                  label="Ceramic Tile Multiplier"
                  type="number"
                  step="0.01"
                  error={errors.ceramicTileMultiplier?.message}
                  {...register('ceramicTileMultiplier', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />

                <Input
                  label="Natural Stone Multiplier"
                  type="number"
                  step="0.01"
                  error={errors.naturalStoneMultiplier?.message}
                  {...register('naturalStoneMultiplier', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />
              </div>

              {/* Frame Multipliers */}
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900 border-b pb-2">Frame Multipliers</h3>
                
                <Input
                  label="Aluminum Frame Multiplier"
                  type="number"
                  step="0.01"
                  error={errors.aluminumFrameMultiplier?.message}
                  {...register('aluminumFrameMultiplier', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />

                <Input
                  label="Wood Frame Multiplier"
                  type="number"
                  step="0.01"
                  error={errors.woodFrameMultiplier?.message}
                  {...register('woodFrameMultiplier', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />

                <Input
                  label="PVC Frame Multiplier"
                  type="number"
                  step="0.01"
                  error={errors.pvcFrameMultiplier?.message}
                  {...register('pvcFrameMultiplier', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />
              </div>

              {/* Ceiling Multipliers */}
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900 border-b pb-2">Ceiling Multipliers</h3>
                
                <Input
                  label="Plaster Ceiling Multiplier"
                  type="number"
                  step="0.01"
                  error={errors.plasterCeilingMultiplier?.message}
                  {...register('plasterCeilingMultiplier', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />

                <Input
                  label="Drywall Ceiling Multiplier"
                  type="number"
                  step="0.01"
                  error={errors.drywallCeilingMultiplier?.message}
                  {...register('drywallCeilingMultiplier', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />

                <Input
                  label="Suspended Ceiling Multiplier"
                  type="number"
                  step="0.01"
                  error={errors.suspendedCeilingMultiplier?.message}
                  {...register('suspendedCeilingMultiplier', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />
              </div>

              {/* Roof Multipliers */}
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900 border-b pb-2">Roof Multipliers</h3>
                
                <Input
                  label="Ceramic Tile Roof Multiplier"
                  type="number"
                  step="0.01"
                  error={errors.ceramicTileRoofMultiplier?.message}
                  {...register('ceramicTileRoofMultiplier', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />

                <Input
                  label="Metal Roof Multiplier"
                  type="number"
                  step="0.01"
                  error={errors.metalRoofMultiplier?.message}
                  {...register('metalRoofMultiplier', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />

                <Input
                  label="Concrete Roof Multiplier"
                  type="number"
                  step="0.01"
                  error={errors.concreteRoofMultiplier?.message}
                  {...register('concreteRoofMultiplier', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />
              </div>

              {/* Foundation Multipliers */}
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900 border-b pb-2">Foundation Multipliers</h3>
                
                <Input
                  label="Shallow Foundation Multiplier"
                  type="number"
                  step="0.01"
                  error={errors.shallowFoundationMultiplier?.message}
                  {...register('shallowFoundationMultiplier', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />

                <Input
                  label="Deep Foundation Multiplier"
                  type="number"
                  step="0.01"
                  error={errors.deepFoundationMultiplier?.message}
                  {...register('deepFoundationMultiplier', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />

                <Input
                  label="Pile Foundation Multiplier"
                  type="number"
                  step="0.01"
                  error={errors.pileFoundationMultiplier?.message}
                  {...register('pileFoundationMultiplier', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />
              </div>

              {/* Base Costs */}
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900 border-b pb-2">Base Costs (R$/m²)</h3>
                
                <Input
                  label="Base Construction Cost"
                  type="number"
                  step="0.01"
                  error={errors.baseConstructionCost?.message}
                  {...register('baseConstructionCost', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />

                <Input
                  label="Base Electrical Cost"
                  type="number"
                  step="0.01"
                  error={errors.baseElectricalCost?.message}
                  {...register('baseElectricalCost', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />

                <Input
                  label="Base Plumbing Cost"
                  type="number"
                  step="0.01"
                  error={errors.basePlumbingCost?.message}
                  {...register('basePlumbingCost', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />
              </div>

              {/* Additional Costs */}
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900 border-b pb-2">Additional Costs</h3>
                
                <Input
                  label="Project Management Cost (%)"
                  type="number"
                  step="0.01"
                  error={errors.projectManagementCost?.message}
                  {...register('projectManagementCost', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />

                <Input
                  label="Contingency Cost (%)"
                  type="number"
                  step="0.01"
                  error={errors.contingencyCost?.message}
                  {...register('contingencyCost', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />

                <Input
                  label="Tax Rate (%)"
                  type="number"
                  step="0.01"
                  error={errors.taxRate?.message}
                  {...register('taxRate', {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (originalData) {
                    reset(originalData);
                    setHasChanges(false);
                  }
                }}
                disabled={!hasChanges}
              >
                Cancel Changes
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!hasChanges || isSaving}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 