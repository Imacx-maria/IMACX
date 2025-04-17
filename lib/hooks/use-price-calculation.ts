import { useState, useEffect, useCallback } from 'react';
import {
  fetchMaterialTypes,
  fetchMaterialsByType,
  fetchCharacteristicsByTypeAndMaterial,
  fetchColorsByTypeAndMaterialAndCharacteristic,
  fetchMachines,
  fetchMaterialPrice,
  fetchMachinePrice,
  saveCalculation,
  loadCalculation,
  fetchAllCalculations, // Added for fetching table data
  generateCalculationId,
  type CalculationData
} from '../supabase/price-calculation';

// Type for material selection
export type MaterialSelection = {
  tipo: string;
  material: string;
  caracteristica: string;
  cor: string;
  id?: number;
  price?: number;
};

// Type for machine selection
export type MachineSelection = {
  id: string;
  maquina: string;
  valor_m2: number;
  integer_id: number;
  is4_4: boolean; // Toggle for 4/4 (multiply by 2)
};

// Type for calculation results
export type CalculationResults = {
  custoTotalMateriais: number;
  custoTotalMaquina: number;
  custoLiquidoTotal: number;
  precoFinal: number;
  diferencaPercentual: number;
};

/**
 * Hook for managing material selections
 */
export function useMaterialsData() {
  // Available options for dropdowns
  const [tipoOptions, setTipoOptions] = useState<string[]>([]);
  
  // Separate options for each material panel
  const [material1Options, setMaterial1Options] = useState<string[]>([]);
  const [material1CaracteristicaOptions, setMaterial1CaracteristicaOptions] = useState<string[]>([]);
  const [material1CorOptions, setMaterial1CorOptions] = useState<string[]>([]);
  
  const [material2Options, setMaterial2Options] = useState<string[]>([]);
  const [material2CaracteristicaOptions, setMaterial2CaracteristicaOptions] = useState<string[]>([]);
  const [material2CorOptions, setMaterial2CorOptions] = useState<string[]>([]);
  
  const [material3Options, setMaterial3Options] = useState<string[]>([]);
  const [material3CaracteristicaOptions, setMaterial3CaracteristicaOptions] = useState<string[]>([]);
  const [material3CorOptions, setMaterial3CorOptions] = useState<string[]>([]);
  
  // Loading states
  const [isLoadingTipos, setIsLoadingTipos] = useState(false);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);
  const [isLoadingCaracteristicas, setIsLoadingCaracteristicas] = useState(false);
  const [isLoadingCores, setIsLoadingCores] = useState(false);

  // Error and empty states for Material 1
  const [material1Error, setMaterial1Error] = useState<string | null>(null);
  const [material1Empty, setMaterial1Empty] = useState(false);
  const [material1CaracteristicaError, setMaterial1CaracteristicaError] = useState<string | null>(null);
  const [material1CaracteristicaEmpty, setMaterial1CaracteristicaEmpty] = useState(false);
  const [material1CorError, setMaterial1CorError] = useState<string | null>(null);
  const [material1CorEmpty, setMaterial1CorEmpty] = useState(false);

  // Error and empty states for Material 2
  const [material2Error, setMaterial2Error] = useState<string | null>(null);
  const [material2Empty, setMaterial2Empty] = useState(false);
  const [material2CaracteristicaError, setMaterial2CaracteristicaError] = useState<string | null>(null);
  const [material2CaracteristicaEmpty, setMaterial2CaracteristicaEmpty] = useState(false);
  const [material2CorError, setMaterial2CorError] = useState<string | null>(null);
  const [material2CorEmpty, setMaterial2CorEmpty] = useState(false);

  // Error and empty states for Material 3
  const [material3Error, setMaterial3Error] = useState<string | null>(null);
  const [material3Empty, setMaterial3Empty] = useState(false);
  const [material3CaracteristicaError, setMaterial3CaracteristicaError] = useState<string | null>(null);
  const [material3CaracteristicaEmpty, setMaterial3CaracteristicaEmpty] = useState(false);
  const [material3CorError, setMaterial3CorError] = useState<string | null>(null);
  const [material3CorEmpty, setMaterial3CorEmpty] = useState(false);

  
  // Material selections for each panel
  const [material1, setMaterial1] = useState<MaterialSelection>({
    tipo: '',
    material: '',
    caracteristica: '',
    cor: ''
  });
  
  const [material2, setMaterial2] = useState<MaterialSelection>({
    tipo: '',
    material: '',
    caracteristica: '',
    cor: ''
  });
  
  const [material3, setMaterial3] = useState<MaterialSelection>({
    tipo: '',
    material: '',
    caracteristica: '',
    cor: ''
  });

  // Fetch material types on component mount
  useEffect(() => {
    const loadTipos = async () => {
      setIsLoadingTipos(true);
      try {
        const tipos = await fetchMaterialTypes();
        setTipoOptions(tipos);
      } catch (error) {
        console.error('Error loading tipos:', error);
      } finally {
        setIsLoadingTipos(false);
      }
    };
    
    loadTipos();
  }, []);

  // Fetch materials when tipo changes for Material 1
  const loadMaterials1 = useCallback(async (tipo: string) => {
    if (!tipo) {
      setMaterial1Options([]);
      return;
    }
    
    setIsLoadingMaterials(true);
    try {
      const materials = await fetchMaterialsByType(tipo);
      setMaterial1Options(materials);
    } catch (error) {
      console.error('Error loading materials for Material 1:', error);
    } finally {
      setIsLoadingMaterials(false);
    }
  }, []);

  // Fetch materials when tipo changes for Material 2
  const loadMaterials2 = useCallback(async (tipo: string) => {
    if (!tipo) {
      setMaterial2Options([]);
      return;
    }
    
    setIsLoadingMaterials(true);
    try {
      const materials = await fetchMaterialsByType(tipo);
      setMaterial2Options(materials);
    } catch (error) {
      console.error('Error loading materials for Material 2:', error);
    } finally {
      setIsLoadingMaterials(false);
    }
  }, []);

  // Fetch materials when tipo changes for Material 3
  const loadMaterials3 = useCallback(async (tipo: string) => {
    if (!tipo) {
      setMaterial3Options([]);
      return;
    }
    
    setIsLoadingMaterials(true);
    try {
      const materials = await fetchMaterialsByType(tipo);
      setMaterial3Options(materials);
    } catch (error) {
      console.error('Error loading materials for Material 3:', error);
    } finally {
      setIsLoadingMaterials(false);
    }
  }, []);

  // Fetch caracteristicas for Material 1
  const loadCaracteristicas1 = useCallback(async (tipo: string, material: string) => {
    if (!tipo || !material) {
      setMaterial1CaracteristicaOptions([]);
      return;
    }
    
    setIsLoadingCaracteristicas(true);
    try {
      const caracteristicas = await fetchCharacteristicsByTypeAndMaterial(tipo, material);
      setMaterial1CaracteristicaOptions(caracteristicas);
    } catch (error) {
      console.error('Error loading caracteristicas for Material 1:', error);
    } finally {
      setIsLoadingCaracteristicas(false);
    }
  }, []);

  // Fetch caracteristicas for Material 2
  const loadCaracteristicas2 = useCallback(async (tipo: string, material: string) => {
    if (!tipo || !material) {
      setMaterial2CaracteristicaOptions([]);
      return;
    }
    
    setIsLoadingCaracteristicas(true);
    try {
      const caracteristicas = await fetchCharacteristicsByTypeAndMaterial(tipo, material);
      setMaterial2CaracteristicaOptions(caracteristicas);
    } catch (error) {
      console.error('Error loading caracteristicas for Material 2:', error);
    } finally {
      setIsLoadingCaracteristicas(false);
    }
  }, []);

  // Fetch caracteristicas for Material 3
  const loadCaracteristicas3 = useCallback(async (tipo: string, material: string) => {
    if (!tipo || !material) {
      setMaterial3CaracteristicaOptions([]);
      return;
    }
    
    setIsLoadingCaracteristicas(true);
    try {
      const caracteristicas = await fetchCharacteristicsByTypeAndMaterial(tipo, material);
      setMaterial3CaracteristicaOptions(caracteristicas);
    } catch (error) {
      console.error('Error loading caracteristicas for Material 3:', error);
    } finally {
      setIsLoadingCaracteristicas(false);
    }
  }, []);

  // Fetch cores for Material 1
  const loadCores1 = useCallback(async (tipo: string, material: string, caracteristica: string) => {
    if (!tipo || !material || !caracteristica) {
      setMaterial1CorOptions([]);
      return;
    }
    
    setIsLoadingCores(true);
    try {
      const cores = await fetchColorsByTypeAndMaterialAndCharacteristic(tipo, material, caracteristica);
      setMaterial1CorOptions(cores);
    } catch (error) {
      console.error('Error loading cores for Material 1:', error);
    } finally {
      setIsLoadingCores(false);
    }
  }, []);

  // Fetch cores for Material 2
  const loadCores2 = useCallback(async (tipo: string, material: string, caracteristica: string) => {
    if (!tipo || !material || !caracteristica) {
      setMaterial2CorOptions([]);
      return;
    }
    
    setIsLoadingCores(true);
    try {
      const cores = await fetchColorsByTypeAndMaterialAndCharacteristic(tipo, material, caracteristica);
      setMaterial2CorOptions(cores);
    } catch (error) {
      console.error('Error loading cores for Material 2:', error);
    } finally {
      setIsLoadingCores(false);
    }
  }, []);

  // Fetch cores for Material 3
  const loadCores3 = useCallback(async (tipo: string, material: string, caracteristica: string) => {
    if (!tipo || !material || !caracteristica) {
      setMaterial3CorOptions([]);
      return;
    }
    
    setIsLoadingCores(true);
    try {
      const cores = await fetchColorsByTypeAndMaterialAndCharacteristic(tipo, material, caracteristica);
      setMaterial3CorOptions(cores);
    } catch (error) {
      console.error('Error loading cores for Material 3:', error);
    } finally {
      setIsLoadingCores(false);
    }
  }, []);

  // Fetch material price when all selections are made
  const loadMaterialPrice = useCallback(async (
    materialState: MaterialSelection,
    setMaterialState: React.Dispatch<React.SetStateAction<MaterialSelection>>
  ) => {
    const { tipo, material, caracteristica, cor } = materialState;
    
    if (!tipo || !material || !caracteristica || !cor) {
      return;
    }
    
    try {
      const { id, price } = await fetchMaterialPrice(tipo, material, caracteristica, cor);
      setMaterialState(prev => ({
        ...prev,
        id,
        price
      }));
    } catch (error) {
      console.error('Error loading material price:', error);
    }
  }, []);

  // Update material1 selections
  const updateMaterial1 = useCallback((field: keyof MaterialSelection, value: string) => {
    setMaterial1(prev => {
      const newState = { ...prev, [field]: value };
      
      // Reset dependent fields
      if (field === 'tipo') {
        newState.material = '';
        newState.caracteristica = '';
        newState.cor = '';
        newState.price = undefined;
        newState.id = undefined;
        setMaterial1Options([]); // Clear options immediately
        setMaterial1CaracteristicaOptions([]);
        setMaterial1CorOptions([]);
        loadMaterials1(value);
      } else if (field === 'material') {
        newState.caracteristica = '';
        newState.cor = '';
        newState.price = undefined;
        newState.id = undefined;
        setMaterial1CaracteristicaOptions([]); // Clear options immediately
        setMaterial1CorOptions([]);
        if (newState.tipo && value) {
          loadCaracteristicas1(newState.tipo, value);
        }
      } else if (field === 'caracteristica') {
        newState.cor = '';
        newState.price = undefined;
        newState.id = undefined;
        setMaterial1CorOptions([]); // Clear options immediately
        if (newState.tipo && newState.material && value) {
          loadCores1(newState.tipo, newState.material, value);
        }
      } else if (field === 'cor') {
        newState.price = undefined;
        newState.id = undefined;
        if (newState.tipo && newState.material && newState.caracteristica && value) {
          loadMaterialPrice(newState, setMaterial1);
        }
      }
      
      return newState;
    });
  }, [loadMaterials1, loadCaracteristicas1, loadCores1, loadMaterialPrice]);

  // Update material2 selections
  const updateMaterial2 = useCallback((field: keyof MaterialSelection, value: string) => {
    setMaterial2(prev => {
      const newState = { ...prev, [field]: value };
      
      // Reset dependent fields
      if (field === 'tipo') {
        newState.material = '';
        newState.caracteristica = '';
        newState.cor = '';
        newState.price = undefined;
        newState.id = undefined;
        setMaterial2Options([]); // Clear options immediately
        setMaterial2CaracteristicaOptions([]);
        setMaterial2CorOptions([]);
        loadMaterials2(value);
      } else if (field === 'material') {
        newState.caracteristica = '';
        newState.cor = '';
        newState.price = undefined;
        newState.id = undefined;
        setMaterial2CaracteristicaOptions([]); // Clear options immediately
        setMaterial2CorOptions([]);
        if (newState.tipo && value) {
          loadCaracteristicas2(newState.tipo, value);
        }
      } else if (field === 'caracteristica') {
        newState.cor = '';
        newState.price = undefined;
        newState.id = undefined;
        setMaterial2CorOptions([]); // Clear options immediately
        if (newState.tipo && newState.material && value) {
          loadCores2(newState.tipo, newState.material, value);
        }
      } else if (field === 'cor') {
        newState.price = undefined;
        newState.id = undefined;
        if (newState.tipo && newState.material && newState.caracteristica && value) {
          loadMaterialPrice(newState, setMaterial2);
        }
      }
      
      return newState;
    });
  }, [loadMaterials2, loadCaracteristicas2, loadCores2, loadMaterialPrice]);

  // Update material3 selections
  const updateMaterial3 = useCallback((field: keyof MaterialSelection, value: string) => {
    setMaterial3(prev => {
      const newState = { ...prev, [field]: value };
      
      // Reset dependent fields
      if (field === 'tipo') {
        newState.material = '';
        newState.caracteristica = '';
        newState.cor = '';
        newState.price = undefined;
        newState.id = undefined;
        setMaterial3Options([]); // Clear options immediately
        setMaterial3CaracteristicaOptions([]);
        setMaterial3CorOptions([]);
        loadMaterials3(value);
      } else if (field === 'material') {
        newState.caracteristica = '';
        newState.cor = '';
        newState.price = undefined;
        newState.id = undefined;
        setMaterial3CaracteristicaOptions([]); // Clear options immediately
        setMaterial3CorOptions([]);
        if (newState.tipo && value) {
          loadCaracteristicas3(newState.tipo, value);
        }
      } else if (field === 'caracteristica') {
        newState.cor = '';
        newState.price = undefined;
        newState.id = undefined;
        setMaterial3CorOptions([]); // Clear options immediately
        if (newState.tipo && newState.material && value) {
          loadCores3(newState.tipo, newState.material, value);
        }
      } else if (field === 'cor') {
        newState.price = undefined;
        newState.id = undefined;
        if (newState.tipo && newState.material && newState.caracteristica && value) {
          loadMaterialPrice(newState, setMaterial3);
        }
      }
      
      return newState;
    });
  }, [loadMaterials3, loadCaracteristicas3, loadCores3, loadMaterialPrice]);

  return {
    // Options for dropdowns
    tipoOptions,
    material1Options,
    material1CaracteristicaOptions,
    material1CorOptions,
    material2Options,
    material2CaracteristicaOptions,
    material2CorOptions,
    material3Options,
    material3CaracteristicaOptions,
    material3CorOptions,
    
    // Loading states
    isLoadingTipos,
    isLoadingMaterials,
    isLoadingCaracteristicas,
    isLoadingCores,
    
    // Material selections
    material1,
    material2,
    material3,
    
    // Update functions
    updateMaterial1,
    updateMaterial2,
    updateMaterial3,
    
    // Set functions (for loading saved calculations)
    setMaterial1,
    setMaterial2,
    setMaterial3
  };
}

/**
 * Hook for managing machine selections
 */
export function useMachinesData() {
  const [machines, setMachines] = useState<MachineSelection[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<MachineSelection | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch machines on component mount
  useEffect(() => {
    const loadMachines = async () => {
      setIsLoading(true);
      try {
        const machinesData = await fetchMachines();
        const machinesWithToggle = machinesData.map(machine => ({
          ...machine,
          is4_4: false
        }));
        setMachines(machinesWithToggle);
      } catch (error) {
        console.error('Error loading machines:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMachines();
  }, []);

  // Update selected machine
  const updateSelectedMachine = useCallback((machineId: string) => {
    const machine = machines.find(m => m.id === machineId);
    if (machine) {
      setSelectedMachine(machine);
    }
  }, [machines]);

  // Toggle 4/4 option
  const toggle4_4 = useCallback((value: boolean) => {
    if (selectedMachine) {
      setSelectedMachine({
        ...selectedMachine,
        is4_4: value
      });
    }
  }, [selectedMachine]);

  return {
    machines,
    selectedMachine,
    isLoading,
    updateSelectedMachine,
    toggle4_4,
    setSelectedMachine
  };
}

/**
 * Hook for managing calculations
 */
export function useCalculations() {
  const [margin, setMargin] = useState<number>(35); // Default margin 35%
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [metrosQuadrados, setMetrosQuadrados] = useState<number>(1); // Default 1m²
  const [notes, setNotes] = useState<string>('');
  const [calculationResults, setCalculationResults] = useState<CalculationResults>({
    custoTotalMateriais: 0,
    custoTotalMaquina: 0,
    custoLiquidoTotal: 0,
    precoFinal: 0,
    diferencaPercentual: 0
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [calculationId, setCalculationId] = useState<string>('');

  // State for the price table data
  const [priceTableData, setPriceTableData] = useState<any[]>([]); // Using any for now, will refine later
  const [isLoadingTableData, setIsLoadingTableData] = useState(false);


  // Calculate totals based on material and machine selections
  const calculateTotals = useCallback((
    materials: MaterialSelection[],
    machine: MachineSelection | null,
    marginValue: number,
    currentPriceValue: number,
    metrosQuadradosValue: number
  ) => {
    // Filter out materials without prices
    const validMaterials = materials.filter(m => m.price !== undefined);
    
    // Calculate total material cost
    const custoTotalMateriais = validMaterials.reduce((sum, material) => {
      return sum + (material.price || 0) * metrosQuadradosValue;
    }, 0);
    
    // Calculate machine cost
    const machinePrice = machine ? machine.valor_m2 * (machine.is4_4 ? 2 : 1) : 0;
    const custoTotalMaquina = machinePrice * metrosQuadradosValue;
    
    // Calculate total liquid cost
    const custoLiquidoTotal = custoTotalMateriais + custoTotalMaquina;
    
    // Calculate final price with margin
    const precoFinal = custoLiquidoTotal * (1 + marginValue / 100);
    
    // Calculate percentage difference
    const diferencaPercentual = precoFinal > 0 
      ? ((currentPriceValue - precoFinal) / precoFinal) * 100 
      : 0;
    
    setCalculationResults({
      custoTotalMateriais,
      custoTotalMaquina,
      custoLiquidoTotal,
      precoFinal,
      diferencaPercentual
    });
    
    return {
      custoTotalMateriais,
      custoTotalMaquina,
      custoLiquidoTotal,
      precoFinal,
      diferencaPercentual
    };
  }, []);

  // Save calculation to database
  const saveCalculationToDb = useCallback(async (
    material1: MaterialSelection,
    material2: MaterialSelection,
    material3: MaterialSelection,
    machine: MachineSelection | null,
    results: CalculationResults
  ) => {
    console.log('saveCalculationToDb called with:', { material1, material2, material3, machine, results });
    
    if (!machine) {
      console.error('Machine selection is required');
      throw new Error('Machine selection is required');
    }
    
    setIsSaving(true);
    
    try {
      // Generate a new calculation ID if not already set
      const calcId = calculationId || generateCalculationId();
      console.log('Using calculation ID:', calcId);
      
      const calculationData: CalculationData = {
        calculation_id: calcId,
        
        // Material 1
        material1_id: material1.id,
        material1_tipo: material1.tipo,
        material1_material: material1.material,
        material1_caracteristica: material1.caracteristica,
        material1_cor: material1.cor,
        material1_valor_m2: material1.price,
        
        // Material 2 (if selected)
        ...(material2.tipo && {
          material2_id: material2.id,
          material2_tipo: material2.tipo,
          material2_material: material2.material,
          material2_caracteristica: material2.caracteristica,
          material2_cor: material2.cor,
          material2_valor_m2: material2.price,
        }),
        
        // Material 3 (if selected)
        ...(material3.tipo && {
          material3_id: material3.id,
          material3_tipo: material3.tipo,
          material3_material: material3.material,
          material3_caracteristica: material3.caracteristica,
          material3_cor: material3.cor,
          material3_valor_m2: material3.price,
        }),
        
        // Machine
        maquina_id: machine.integer_id,
        maquina_nome: machine.maquina,
        maquina_valor_m2: machine.valor_m2 * (machine.is4_4 ? 2 : 1),
        maquina_uuid: machine.id,
        
        // Calculation fields
        metros_quadrados: metrosQuadrados,
        custo_total_materiais: results.custoTotalMateriais,
        custo_total_maquina: results.custoTotalMaquina,
        custo_liquido_total: results.custoLiquidoTotal,
        margem: margin,
        preco_final: results.precoFinal,
        preco_atual: currentPrice,
        diferenca_percentual: results.diferencaPercentual,
        notas: notes
      };
      
      console.log('Calculation data prepared:', calculationData);
      
      try {
        const savedCalculation = await saveCalculation(calculationData);
        console.log('Calculation saved successfully:', savedCalculation);
        setCalculationId(calcId);
        return savedCalculation;
      } catch (saveError) {
        console.error('Error in saveCalculation:', saveError);
        throw saveError;
      }
    } catch (error) {
      console.error('Error in saveCalculationToDb:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [calculationId, margin, currentPrice, metrosQuadrados, notes]);

  // Load calculation from database
  const loadCalculationFromDb = useCallback(async (
    calcId: string,
    setMaterial1: React.Dispatch<React.SetStateAction<MaterialSelection>>,
    setMaterial2: React.Dispatch<React.SetStateAction<MaterialSelection>>,
    setMaterial3: React.Dispatch<React.SetStateAction<MaterialSelection>>,
    setSelectedMachine: React.Dispatch<React.SetStateAction<MachineSelection | null>>,
    machines: MachineSelection[],
    updateFunctions?: {
      updateMaterial1?: (field: keyof MaterialSelection, value: string) => void;
      updateMaterial2?: (field: keyof MaterialSelection, value: string) => void;
      updateMaterial3?: (field: keyof MaterialSelection, value: string) => void;
    }
  ) => {
    setIsLoading(true);
    console.log('Loading calculation from DB with ID:', calcId);
    
    try {
      const calculation = await loadCalculation(calcId);
      console.log('Calculation loaded:', calculation);
      
      // Set calculation ID
      setCalculationId(calculation.calculation_id);
      
      // Use the update functions that handle cascading loads
      if (calculation.material1_tipo) {
        console.log('Setting material 1:', calculation.material1_tipo);
        
        // Use the update functions if provided
        const updateMaterial1 = updateFunctions?.updateMaterial1;
        if (updateMaterial1) {
          // Set tipo first
          updateMaterial1('tipo', calculation.material1_tipo || '');
          
          // Wait a bit for materials to load
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Set material
          if (calculation.material1_material) {
            updateMaterial1('material', calculation.material1_material || '');
            
            // Wait a bit for caracteristicas to load
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Set caracteristica
            if (calculation.material1_caracteristica) {
              updateMaterial1('caracteristica', calculation.material1_caracteristica || '');
              
              // Wait a bit for cores to load
              await new Promise(resolve => setTimeout(resolve, 300));
              
              // Set cor
              if (calculation.material1_cor) {
                updateMaterial1('cor', calculation.material1_cor || '');
              }
            }
          }
        } else {
          // Fallback to direct setting if update function not available
          setMaterial1({
            id: calculation.material1_id,
            tipo: calculation.material1_tipo || '',
            material: calculation.material1_material || '',
            caracteristica: calculation.material1_caracteristica || '',
            cor: calculation.material1_cor || '',
            price: calculation.material1_valor_m2
          });
        }
      }
      
      // Set material 2 using update function
      if (calculation.material2_tipo) {
        console.log('Setting material 2:', calculation.material2_tipo);
        
        const updateMaterial2 = updateFunctions?.updateMaterial2;
        if (updateMaterial2) {
          // Set tipo first
          updateMaterial2('tipo', calculation.material2_tipo || '');
          
          // Wait a bit for materials to load
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Set material
          if (calculation.material2_material) {
            updateMaterial2('material', calculation.material2_material || '');
            
            // Wait a bit for caracteristicas to load
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Set caracteristica
            if (calculation.material2_caracteristica) {
              updateMaterial2('caracteristica', calculation.material2_caracteristica || '');
              
              // Wait a bit for cores to load
              await new Promise(resolve => setTimeout(resolve, 300));
              
              // Set cor
              if (calculation.material2_cor) {
                updateMaterial2('cor', calculation.material2_cor || '');
              }
            }
          }
        } else {
          // Fallback to direct setting
          setMaterial2({
            id: calculation.material2_id,
            tipo: calculation.material2_tipo || '',
            material: calculation.material2_material || '',
            caracteristica: calculation.material2_caracteristica || '',
            cor: calculation.material2_cor || '',
            price: calculation.material2_valor_m2
          });
        }
      }
      
      // Set material 3 using update function
      if (calculation.material3_tipo) {
        console.log('Setting material 3:', calculation.material3_tipo);
        
        const updateMaterial3 = updateFunctions?.updateMaterial3;
        if (updateMaterial3) {
          // Set tipo first
          updateMaterial3('tipo', calculation.material3_tipo || '');
          
          // Wait a bit for materials to load
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Set material
          if (calculation.material3_material) {
            updateMaterial3('material', calculation.material3_material || '');
            
            // Wait a bit for caracteristicas to load
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Set caracteristica
            if (calculation.material3_caracteristica) {
              updateMaterial3('caracteristica', calculation.material3_caracteristica || '');
              
              // Wait a bit for cores to load
              await new Promise(resolve => setTimeout(resolve, 300));
              
              // Set cor
              if (calculation.material3_cor) {
                updateMaterial3('cor', calculation.material3_cor || '');
              }
            }
          }
        } else {
          // Fallback to direct setting
          setMaterial3({
            id: calculation.material3_id,
            tipo: calculation.material3_tipo || '',
            material: calculation.material3_material || '',
            caracteristica: calculation.material3_caracteristica || '',
            cor: calculation.material3_cor || '',
            price: calculation.material3_valor_m2
          });
        }
      }
      
      // Set machine
      if (calculation.maquina_uuid) {
        console.log('Setting machine:', calculation.maquina_uuid);
        const machine = machines.find(m => m.id === calculation.maquina_uuid);
        if (machine) {
          const is4_4 = calculation.maquina_valor_m2 ? calculation.maquina_valor_m2 > machine.valor_m2 : false;
          setSelectedMachine({
            ...machine,
            is4_4
          });
        } else {
          console.warn('Machine not found in available machines:', calculation.maquina_uuid);
        }
      }
      
      // Set other fields
      setMargin(calculation.margem || 35);
      setCurrentPrice(calculation.preco_atual || 0);
      setMetrosQuadrados(calculation.metros_quadrados || 1);
      setNotes(calculation.notas || '');
      
      // Set calculation results
      setCalculationResults({
        custoTotalMateriais: calculation.custo_total_materiais || 0,
        custoTotalMaquina: calculation.custo_total_maquina || 0,
        custoLiquidoTotal: calculation.custo_liquido_total || 0,
        precoFinal: calculation.preco_final || 0,
        diferencaPercentual: calculation.diferenca_percentual || 0
      });
      
      return calculation;
    } catch (error) {
      console.error('Error loading calculation:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch all calculations for the price table
  const fetchPriceTableData = useCallback(async () => {
    setIsLoadingTableData(true);
    console.log('Starting to fetch price table data from Supabase...');
    try {
      // fetchAllCalculations will be defined in ../supabase/price-calculation
      const data = await fetchAllCalculations(); 
      console.log(`Successfully fetched ${data.length} records for price table`);
      setPriceTableData(data);
    } catch (error) {
      console.error('Error fetching price table data:', error);
      
      // More detailed error checking
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      // Check if it might be a Supabase connection issue
      if (error instanceof Error && error.message.includes('network')) {
        console.error('This appears to be a network connection issue with Supabase');
      }
      
      // If we got here, let the UI know we failed to load data
      setPriceTableData([]); // Set to empty array on error
    } finally {
      setIsLoadingTableData(false);
    }
  }, []);


  return {
    margin,
    setMargin,
    currentPrice,
    setCurrentPrice,
    metrosQuadrados,
    setMetrosQuadrados,
    notes,
    setNotes,
    calculationResults,
    calculateTotals,
    saveCalculationToDb,
    loadCalculationFromDb,
    isSaving,
    isLoading,
    calculationId,
    setCalculationId,
    // Price table related exports
    priceTableData,
    isLoadingTableData,
    fetchPriceTableData
  };
}