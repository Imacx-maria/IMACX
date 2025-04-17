"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon, SearchIcon, PlusIcon, XIcon, CheckIcon, SaveIcon, EditIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CardWithGradientBorder } from "@/components/ui/card-with-gradient-border";

import {
  useMaterialsData,
  useMachinesData,
  useCalculations,
  type MaterialSelection
} from "@/lib/hooks/use-price-calculation";

// Define a type for the items in the price table
interface PriceTableItem {
  id: string; // Database record ID
  calculation_id?: string; // Unique calculation ID for loading
  material1_tipo?: string;
  material1_material?: string;
  material1_caracteristica?: string;
  material1_cor?: string;
  material2_tipo?: string;
  material2_material?: string;
  material2_caracteristica?: string;
  material2_cor?: string;
  material3_tipo?: string;
  material3_material?: string;
  material3_caracteristica?: string;
  material3_cor?: string;
  maquina_nome?: string;
  margem?: number;
  custo_liquido_total?: number;
  preco_atual?: number;
  preco_final?: number;
}

export function PriceCalculator() {
  // Search state
  const [searchQuery, setSearchQuery] = useState(""); // Search for Tabela de Preços
  const [calculationIdToLoad, setCalculationIdToLoad] = useState(""); // ID for Construção de Preços load
  const [isEditing, setIsEditing] = useState(false); // Track if we're in edit mode
  const [editingId, setEditingId] = useState<string | null>(null); // Track which record is being edited
  const [notification, setNotification] = useState<{title: string; message: string; type: 'success' | 'error' | 'info'} | null>(null);
  const [activeTab, setActiveTab] = useState("tabela-precos"); // Control active tab
  
  // Simple notification function
  const showNotification = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ title, message, type });
    setTimeout(() => setNotification(null), 5000); // Auto-hide after 5 seconds
  };
  
  // Get hooks data
  const {
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
    isLoadingTipos,
    isLoadingMaterials,
    isLoadingCaracteristicas,
    isLoadingCores,
    material1,
    material2,
    material3,
    updateMaterial1,
    updateMaterial2,
    updateMaterial3,
    setMaterial1,
    setMaterial2,
    setMaterial3
  } = useMaterialsData();
  
  const {
    machines,
    selectedMachine,
    isLoading: isLoadingMachines,
    updateSelectedMachine,
    toggle4_4,
    setSelectedMachine
  } = useMachinesData();
  
  const {
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
    isLoading: isLoadingCalculation,
    calculationId,
    setCalculationId,
    // Added for Tabela de Preços
    priceTableData,
    isLoadingTableData,
    fetchPriceTableData
  } = useCalculations();
  
  // Calculate totals when inputs change
  useEffect(() => {
    const materials = [material1, material2, material3].filter(m => 
      m.tipo && m.material && m.caracteristica && m.cor && m.price !== undefined
    );
    
    calculateTotals(
      materials,
      selectedMachine,
      margin,
      currentPrice,
      metrosQuadrados
    );
  }, [
    material1, 
    material2, 
    material3, 
    selectedMachine, 
    margin, 
    currentPrice, 
    metrosQuadrados, 
    calculateTotals
  ]);

  // Fetch price table data on mount
  useEffect(() => {
    fetchPriceTableData();
  }, [fetchPriceTableData]);

  // Helper function to format the "Materiais" column
  const formatMateriais = (item: any): string => {
    let materiaisString = "";
    if (item.material1_tipo) {
      materiaisString += `${item.material1_tipo} ${item.material1_material} ${item.material1_caracteristica} ${item.material1_cor}`;
    }
    if (item.material2_tipo) {
      materiaisString += ` + ${item.material2_tipo} ${item.material2_material} ${item.material2_caracteristica} ${item.material2_cor}`;
    }
    if (item.material3_tipo) {
      materiaisString += ` + ${item.material3_tipo} ${item.material3_material} ${item.material3_caracteristica} ${item.material3_cor}`;
    }

    // Add printing description based on maquina_nome
    if (item.maquina_nome) {
      materiaisString += ". ";
      if (item.maquina_nome === 'Fuji' || item.maquina_nome === 'Inca') {
        materiaisString += "Impressão UV 4/0 cores";
      } else if (item.maquina_nome === 'Mimakis') {
        materiaisString += "Impressão Solventes 4/0 cores";
      } else if (item.maquina_nome === 'Mimaki Branco') {
        materiaisString += "Impressão Solventes 4+Branco cores";
      } else {
        // Optional: handle other machine names if necessary
        materiaisString += `Impressão ${item.maquina_nome}`;
      }
    }
    
    return materiaisString.trim();
  };

  // Helper function to calculate the percentage difference
  const calculateDiferenca = (precoFinal?: number, precoAtual?: number): number => {
    if (precoFinal === undefined || precoAtual === undefined || precoAtual === 0) {
      return 0; // Or handle as NaN or specific indicator if needed
    }
    return ((precoFinal - precoAtual) / precoAtual) * 100;
  };

  // Handle Edit button click
  const handleEditClick = async (calcId: string) => {
    console.log('Edit button clicked for ID:', calcId); // Debug log
    setCalculationIdToLoad(calcId); // Set the ID for loading
    setIsEditing(true); // Set editing mode
    setEditingId(calcId); // Set which record is being edited
    try {
      console.log('Loading calculation from DB...'); // Debug log
      await loadCalculationFromDb(
        calcId,
        setMaterial1,
        setMaterial2,
        setMaterial3,
        setSelectedMachine,
        machines,
        {
          updateMaterial1,
          updateMaterial2,
          updateMaterial3
        }
      );
      console.log('Calculation loaded successfully, switching tab...'); // Debug log
      setActiveTab("construcao-precos"); // Switch to the construction tab
      showNotification("Sucesso", "Cálculo carregado para edição.", "success");
    } catch (error) {
      console.error('Error loading calculation for edit:', error);
      setIsEditing(false); // Reset editing mode on error
      setEditingId(null); // Reset editing ID on error
      showNotification("Erro", "Erro ao carregar cálculo para edição.", "error");
    }
  };
  
  // Reset material
  const resetMaterial = (materialNumber: 1 | 2 | 3) => {
    const setMaterial = materialNumber === 1
      ? setMaterial1
      : materialNumber === 2
        ? setMaterial2
        : setMaterial3;
    
    setMaterial({
      tipo: '',
      material: '',
      caracteristica: '',
      cor: '',
      price: undefined,
      id: undefined
    });
  };
  
  // Reset machine
  const resetMachine = () => {
    setSelectedMachine(null);
  };
  
  // New calculation
  const newCalculation = () => {
    console.log('New calculation button clicked');
    
    // Reset all fields
    resetMaterial(1);
    resetMaterial(2);
    resetMaterial(3);
    resetMachine();
    setMargin(35);
    setCurrentPrice(0);
    setMetrosQuadrados(1);
    setNotes('');
    setCalculationIdToLoad('');
    
    // Clear calculation ID to ensure a new one is generated on save
    setCalculationId('');
    
    showNotification("Novo Cálculo", "Formulário limpo para novo cálculo", "success");
  };
  
  // Save calculation
  const saveCalculation = async () => {
    // If we're in edit mode, show a different message
    const isEditMode = isEditing && editingId;
    console.log('Save calculation button clicked');
    console.log('Material 1:', material1);
    console.log('Selected Machine:', selectedMachine);
    
    try {
      // Validate required fields
      if (!material1.tipo || !material1.material || !material1.caracteristica || !material1.cor) {
        showNotification("Erro", "Material 1 é obrigatório", "error");
        return;
      }
      
      if (!selectedMachine) {
        console.error('No machine selected');
        showNotification("Erro", "Selecione uma máquina", "error");
        
        // Add a more visible notification in the UI
        setNotification({
          title: "Erro ao Guardar",
          message: "É necessário selecionar uma máquina antes de guardar o cálculo",
          type: "error"
        });
        
        return;
      }
      
      console.log('Calling saveCalculationToDb with:', {
        material1,
        material2,
        material3,
        selectedMachine,
        calculationResults
      });
      
      const result = await saveCalculationToDb(
        material1,
        material2,
        material3,
        selectedMachine,
        calculationResults
      );
      console.log("Saved calculation:", result);
      fetchPriceTableData(); // Refresh the table data
      
      // Reset edit mode after saving
      if (isEditMode) {
        setIsEditing(false);
        setEditingId(null);
      }
      showNotification("Sucesso", `Cálculo guardado com sucesso. ID: ${calculationId}`, "success");
    } catch (error) {
      console.error('Error saving calculation:', error);
      showNotification("Erro", "Erro ao guardar cálculo", "error");
    }
  };
  
  // Load calculation
  const loadCalculation = async () => {
    if (!calculationIdToLoad) {
      showNotification("Erro", "Insira um ID de cálculo", "error");
      return;
    }
    
    try {
      await loadCalculationFromDb(
        calculationIdToLoad,
        setMaterial1,
        setMaterial2,
        setMaterial3,
        setSelectedMachine,
        machines
      );
      
      showNotification("Sucesso", "Cálculo carregado com sucesso", "success");
    } catch (error) {
      console.error('Error loading calculation:', error);
      showNotification("Erro", "Erro ao carregar cálculo", "error");
    }
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return `${value.toFixed(2)}€`;
  };
  
  // Format percentage
  const formatPercentage = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
      <TabsList className="grid w-full grid-cols-2 light:bg-border">
        <TabsTrigger value="tabela-precos">Tabela de Preços</TabsTrigger>
        <TabsTrigger value="construcao-precos">Construção de Preços</TabsTrigger>
      </TabsList>
      
      {/* Tabela de Preços Tab */}
      <TabsContent value="tabela-precos" className="space-y-6">
        <Card className="w-full"> {/* Ensure card takes full width */}
          <CardHeader>
            <CardTitle>
              Tabela de Preços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-center justify-between">
              <div className="relative w-full max-w-sm">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por material..."
                  className="pl-10 pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground"
                    onClick={() => setSearchQuery("")}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            
            {/* Add a container with max-width to ensure the table doesn't cause horizontal scrolling */}
            <div className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead className="w-[30%] whitespace-normal">Materiais</TableHead>
                    <TableHead className="w-[8%] text-right">Margem %</TableHead>
                    <TableHead className="w-[12%] text-right">Custo Líquido</TableHead>
                    <TableHead className="w-[12%] text-right">Preço Atual</TableHead>
                    <TableHead className="w-[15%] text-right">Preço Final</TableHead>
                    <TableHead className="w-[10%] text-right">Diferença %</TableHead>
                    <TableHead className="w-[8%] text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {isLoadingTableData ? (
                  <TableRow><TableCell colSpan={8} className="text-center">Carregando dados da tabela...</TableCell></TableRow>
                ) : priceTableData && priceTableData.length > 0 ? (
                  priceTableData
                    .filter((item: PriceTableItem) => {
                      const materiaisString = formatMateriais(item).toLowerCase();
                      return materiaisString.includes(searchQuery.toLowerCase());
                    })
                    .map((item: PriceTableItem) => {
                      const diferenca = calculateDiferenca(item.preco_final, item.preco_atual);
                      const diferencaColor = diferenca === 0 ? 'text-muted-foreground' : diferenca > 0 ? 'text-red-500' : 'text-green-500';
                      
                      return (
                        <TableRow key={item.id} className="even:bg-muted/50 light:even:bg-gray-100">
                          <TableCell className="font-mono text-xs">{item.id}</TableCell>
                          <TableCell className="whitespace-normal break-words">{formatMateriais(item)}</TableCell>
                          <TableCell className="text-right">{item.margem ? `${item.margem}%` : '-'}</TableCell>
                          <TableCell className="text-right">{item.custo_liquido_total ? formatCurrency(item.custo_liquido_total) : '-'}</TableCell>
                          <TableCell className="text-right">{item.preco_atual ? formatCurrency(item.preco_atual) : '-'}</TableCell>
                          <TableCell className="text-right">{item.preco_final ? formatCurrency(item.preco_final) : '-'}</TableCell>
                          <TableCell className={`text-right ${diferencaColor}`}>{formatPercentage(diferenca)}</TableCell>
                          <TableCell className="text-center">
                            <div className="relative group">
                              <Button
                                variant={editingId === item.id ? "default" : "outline"}
                                size="sm"
                                className={`hover:bg-primary hover:text-primary-foreground focus:ring-2 focus:ring-primary ${editingId === item.id ? "bg-primary text-primary-foreground animate-pulse" : ""}`}
                                onClick={(e) => { e.stopPropagation(); handleEditClick(item.calculation_id || item.id); }}
                                disabled={isEditing && editingId !== item.id}
                              >
                                <EditIcon className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">{editingId === item.id ? "Editando..." : "Editar"}</span>
                              </Button>
                              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                {editingId === item.id ? "Editando este cálculo" : "Editar este cálculo"}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                ) : (
                  <TableRow><TableCell colSpan={8} className="text-center">Nenhum cálculo encontrado.</TableCell></TableRow>
                )}
              </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Construção de Preços Tab */}
      <TabsContent value="construcao-precos" className="space-y-6">
        <Card className="w-full"> {/* Ensure card takes full width */}
          <CardHeader>
            <CardTitle>
              Construção de Preços
            </CardTitle>
          </CardHeader>
          <CardContent className="max-w-full"> {/* Ensure full width */}
            <div className="mb-6 flex items-center justify-between">
              <div className="relative w-full max-w-sm">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar ID..."
                  className="pl-10"
                  value={calculationIdToLoad}
                  onChange={(e) => setCalculationIdToLoad(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadCalculation()}
                />
                {calculationIdToLoad && (
                  <button 
                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground"
                    onClick={() => setCalculationIdToLoad("")}
                  >
                    ×
                  </button>
                )}
              </div>
              
              <div className="flex gap-4">
                <Button onClick={newCalculation} className="mr-0">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Novo Cálculo
                </Button>
                <Button
                  variant="outline"
                  onClick={saveCalculation}
                  disabled={isSaving}
                  className="mr-0"
                >
                  <SaveIcon className="mr-2 h-4 w-4" />
                  {isEditing ? "Guardar Edição" : "Guardar Cálculo"}
                </Button>
              </div>
            </div>
            
            {calculationId && (
              <Alert className="mb-6">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>ID do Cálculo</AlertTitle>
                <AlertDescription>
                  {calculationId}
                </AlertDescription>
            {notification && (
              <Alert className={`mb-6 ${
                notification.type === 'success' ? 'bg-green-100 border-green-500' :
                notification.type === 'error' ? 'bg-red-100 border-red-500' :
                'bg-blue-100 border-blue-500'
              }`}>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>{notification.title}</AlertTitle>
                <AlertDescription>
                  {notification.message}
                </AlertDescription>
              </Alert>
            )}
            
              </Alert>
            )}
            
            {/* Materials Section */}
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3 w-full"> 
              {/* Material 1 */}
              <CardWithGradientBorder className="w-full h-full">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle>Material 1</CardTitle>
                    <CardDescription>Selecione o primeiro material e suas características.</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => resetMaterial(1)}>
                     <XIcon className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Select
                      value={material1.tipo}
                      onValueChange={(value) => updateMaterial1('tipo', value)}
                      disabled={isLoadingTipos}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tipoOptions.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={material1.material}
                      onValueChange={(value) => updateMaterial1('material', value)}
                      disabled={isLoadingMaterials || !material1.tipo}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o Material" />
                      </SelectTrigger>
                      <SelectContent>
                        {material1Options.map((material) => (
                          <SelectItem key={material} value={material}>
                            {material}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={material1.caracteristica}
                      onValueChange={(value) => updateMaterial1('caracteristica', value)}
                      disabled={isLoadingCaracteristicas || !material1.tipo || !material1.material}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a Característica" />
                      </SelectTrigger>
                      <SelectContent>
                        {material1CaracteristicaOptions.map((caracteristica) => (
                          <SelectItem key={caracteristica} value={caracteristica}>
                            {caracteristica}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={material1.cor}
                      onValueChange={(value) => updateMaterial1('cor', value)}
                      disabled={isLoadingCores || !material1.tipo || !material1.material || !material1.caracteristica}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a Cor" />
                      </SelectTrigger>
                      <SelectContent>
                        {material1CorOptions.map((cor) => (
                          <SelectItem key={cor} value={cor}>
                            {cor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                </CardFooter>
              </CardWithGradientBorder>
              
              {/* Material 2 */}
              <CardWithGradientBorder className="w-full h-full">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle>Material 2 (Opcional)</CardTitle>
                    <CardDescription>Selecione o segundo material se necessário (e.g., liner).</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => resetMaterial(2)}>
                     <XIcon className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Select
                      value={material2.tipo}
                      onValueChange={(value) => updateMaterial2('tipo', value)}
                      disabled={isLoadingTipos}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tipoOptions.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={material2.material}
                      onValueChange={(value) => updateMaterial2('material', value)}
                      disabled={isLoadingMaterials || !material2.tipo}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o Material" />
                      </SelectTrigger>
                      <SelectContent>
                        {material2Options.map((material) => (
                          <SelectItem key={material} value={material}>
                            {material}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={material2.caracteristica}
                      onValueChange={(value) => updateMaterial2('caracteristica', value)}
                      disabled={isLoadingCaracteristicas || !material2.tipo || !material2.material}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a Característica" />
                      </SelectTrigger>
                      <SelectContent>
                        {material2CaracteristicaOptions.map((caracteristica) => (
                          <SelectItem key={caracteristica} value={caracteristica}>
                            {caracteristica}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={material2.cor}
                      onValueChange={(value) => updateMaterial2('cor', value)}
                      disabled={isLoadingCores || !material2.tipo || !material2.material || !material2.caracteristica}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a Cor" />
                      </SelectTrigger>
                      <SelectContent>
                        {material2CorOptions.map((cor) => (
                          <SelectItem key={cor} value={cor}>
                            {cor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                </CardFooter>
              </CardWithGradientBorder>
              
              {/* Material 3 */}
              <CardWithGradientBorder className="w-full h-full">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle>Material 3 (Opcional)</CardTitle>
                    <CardDescription>Selecione o terceiro material se necessário (e.g., laminação).</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => resetMaterial(3)}>
                     <XIcon className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Select
                      value={material3.tipo}
                      onValueChange={(value) => updateMaterial3('tipo', value)}
                      disabled={isLoadingTipos}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tipoOptions.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={material3.material}
                      onValueChange={(value) => updateMaterial3('material', value)}
                      disabled={isLoadingMaterials || !material3.tipo}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o Material" />
                      </SelectTrigger>
                      <SelectContent>
                        {material3Options.map((material) => (
                          <SelectItem key={material} value={material}>
                            {material}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={material3.caracteristica}
                      onValueChange={(value) => updateMaterial3('caracteristica', value)}
                      disabled={isLoadingCaracteristicas || !material3.tipo || !material3.material}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a Característica" />
                      </SelectTrigger>
                      <SelectContent>
                        {material3CaracteristicaOptions.map((caracteristica) => (
                          <SelectItem key={caracteristica} value={caracteristica}>
                            {caracteristica}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={material3.cor}
                      onValueChange={(value) => updateMaterial3('cor', value)}
                      disabled={isLoadingCores || !material3.tipo || !material3.material || !material3.caracteristica}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a Cor" />
                      </SelectTrigger>
                      <SelectContent>
                        {material3CorOptions.map((cor) => (
                          <SelectItem key={cor} value={cor}>
                            {cor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                </CardFooter>
              </CardWithGradientBorder>
            </div>
            
            {/* Machine Section */}
            <div className="mb-6 w-full"> 
              <CardWithGradientBorder className="w-full h-full">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle>Máquina</CardTitle>
                    <CardDescription>Selecione a máquina de impressão.</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={resetMachine}>
                     <XIcon className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Select
                      value={selectedMachine?.id || ""}
                      onValueChange={(value) => updateSelectedMachine(value)}
                      disabled={isLoadingMachines}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a Máquina" />
                      </SelectTrigger>
                      <SelectContent>
                        {machines.map((machine) => (
                          <SelectItem key={machine.id} value={machine.id}>
                            {machine.maquina}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="mt-2 flex items-center space-x-2">
                      <Checkbox 
                        id="4_4" 
                        checked={!!selectedMachine?.is4_4} 
                        onCheckedChange={(checked) => toggle4_4(checked === true)}
                        disabled={!selectedMachine}
                      />
                      <label
                        htmlFor="4_4"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        4/4 cores (frente e verso)
                      </label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                </CardFooter>
              </CardWithGradientBorder>
            </div>
            
            
            {/* Costs Section */}
            <div className="mb-6 w-full"> {/* Ensure full width */}
              <Card className="w-full"> {/* Ensure card takes full width */}
                <CardHeader className="py-3">
                  <CardTitle className="text-md">Custos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Custo Total Materiais:</span>
                    <span>{formatCurrency(calculationResults.custoTotalMateriais)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custo Total Máquina:</span>
                    <span>{formatCurrency(calculationResults.custoTotalMaquina)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Custo Líquido Total:</span>
                    <span className="text-orange-500">
                      {formatCurrency(calculationResults.custoLiquidoTotal)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Margin and Final Price Section */}
            <div className="mb-6 w-full"> {/* Ensure full width */}
              <Card className="w-full"> {/* Ensure card takes full width */}
                <CardHeader className="py-3">
                  <CardTitle className="text-md">Margem e Preço Final</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 items-center gap-2">
                        <Label htmlFor="margin">Margem (%):</Label>
                        <Input 
                          id="margin" 
                          type="number" 
                          value={margin.toString()} 
                          onChange={(e) => setMargin(parseFloat(e.target.value) || 0)}
                          className="text-right" 
                        />
                      </div>
                      <div className="grid grid-cols-2 items-center gap-2">
                        <Label htmlFor="currentPrice">Preço Atual:</Label>
                        <Input 
                          id="currentPrice" 
                          type="number" 
                          value={currentPrice.toString()} 
                          onChange={(e) => setCurrentPrice(parseFloat(e.target.value) || 0)}
                          className="text-right" 
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 items-center gap-2">
                        <Label htmlFor="finalPrice">Preço Final:</Label>
                        <Input 
                          id="finalPrice" 
                          value={formatCurrency(calculationResults.precoFinal)} 
                          className="text-right" 
                          readOnly 
                        />
                      </div>
                      <div className="grid grid-cols-2 items-center gap-2">
                        <Label htmlFor="difference">Diferença (%):</Label>
                        <Input 
                          id="difference" 
                          value={formatPercentage(calculationResults.diferencaPercentual)} 
                          className={`text-right ${
                            calculationResults.diferencaPercentual > 0 
                              ? 'text-green-500' 
                              : calculationResults.diferencaPercentual < 0 
                                ? 'text-red-500' 
                                : ''
                          }`}
                          readOnly 
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Notes Section */}
            <div>
              <Label htmlFor="notes" className="mb-2 block">Notas</Label>
              <Textarea 
                id="notes" 
                placeholder="Adicione observações sobre este cálculo..." 
                className="min-h-24"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}