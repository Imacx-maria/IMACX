'use client';

import { useAuth } from "@/lib/auth/auth-context";
import RoleGuard from "@/components/RoleGuard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { WorkOrderSheet } from './components/work-order-sheet';
import { supabase } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Pencil, Eye } from 'lucide-react';

interface WorkOrder {
  id: string;
  numero_fo: string;
  nome_campanha: string;
  profile_id: string;
  prioridade: boolean;
  data_in: string;
  data_saida: string | null;
  profiles?: {
    first_name: string;
  };
  items?: Array<{
    id: string;
    descricao: string;
    codigo?: string;
    em_curso: boolean;
    duvidas: boolean;
    maquete_enviada: boolean;
    paginacao: boolean;
    path_trabalho?: string;
  }>;
}

interface WorkOrderItem {
  id: string;
  descricao: string;
  codigo?: string;
  path_trabalho?: string;
  em_curso: boolean;
  duvidas: boolean;
  data_duvidas?: string;
  maquete_enviada: boolean;
  data_envio?: string;
  paginacao: boolean;
  data_saida?: string;
  notas?: string;
}

interface Designer {
  id: string;
  first_name: string;
}

export default function DesignerFlowPage() {
  return (
    <RoleGuard allowedRoles={['Designer', 'Admin', 'Manager']}>
      <DesignerFlowContent />
    </RoleGuard>
  );
}

function DesignerFlowContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [showOpenOnly, setShowOpenOnly] = useState(true);
  const [selectedDesigner, setSelectedDesigner] = useState('');
  const [foFilter, setFoFilter] = useState('');
  const [itemFilter, setItemFilter] = useState('');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const [newWorkItems, setNewWorkItems] = useState<WorkOrderItem[]>([]);
  const [newWorkOrder, setNewWorkOrder] = useState({
    fo: '',
    nome_campanha: '',
    notas: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchDesigners();
    fetchWorkOrders();
  }, [user, router]);

  const fetchDesigners = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name')
      .eq('role_id', 'designer-role-id'); // Replace with actual designer role ID

    if (error) {
      console.error('Error fetching designers:', error);
      return;
    }

    setDesigners(data || []);
  };

  const fetchWorkOrders = async () => {
    try {
      const query = supabase
        .from('folhas_obras')
        .select(`
          *,
          profiles ( first_name ),
          items ( id, descricao, codigo, em_curso, duvidas, maquete_enviada, paginacao, path_trabalho )
        `)
        .order('prioridade', { ascending: false })
        .order('data_in', { ascending: false });

      if (showOpenOnly) {
        query.is('data_saida', null);
      }

      const { data, error } = await query;

      if (error) throw error;
      setWorkOrders(data || []);
    } catch (error) {
      console.error('Error fetching work orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Update work orders that have been modified
      // Implementation needed based on what fields can be edited
      await fetchWorkOrders(); // Refresh data after save
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSelectedWorkOrder(null);
    setIsDrawerOpen(false);
  };

  const calculateStatus = (items: WorkOrder['items']) => {
    if (!items || items.length === 0) return 0;
    const completed = items.filter(item => item.paginacao).length;
    return Math.round((completed / items.length) * 100);
  };

  const handleAddItem = () => {
    setNewWorkItems(prev => [...prev, {
      id: Math.random().toString(),
      descricao: '',
      em_curso: false,
      duvidas: false,
      maquete_enviada: false,
      paginacao: false
    }]);
  };

  const handleItemChange = (index: number, field: keyof WorkOrderItem, value: any) => {
    setNewWorkItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleDeleteItem = (index: number) => {
    setNewWorkItems(prev => prev.filter((_, i) => i !== index));
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const openDeleteDialog = (index: number) => {
    setItemToDelete(index);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Filters Section */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center space-x-2">
          <Switch
            id="open-works"
            checked={showOpenOnly}
            onCheckedChange={setShowOpenOnly}
          />
          <Label htmlFor="open-works">Trabalhos em aberto</Label>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={selectedDesigner} onValueChange={setSelectedDesigner}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecione Designer" />
            </SelectTrigger>
            <SelectContent>
              {designers.map((designer) => (
                <SelectItem key={designer.id} value={designer.id}>
                  {designer.first_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Filtrar FO"
            value={foFilter}
            onChange={(e) => setFoFilter(e.target.value)}
            className="w-[150px]"
          />

          <Input
            placeholder="Filtrar Item"
            value={itemFilter}
            onChange={(e) => setItemFilter(e.target.value)}
            className="w-[150px]"
          />
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline">
            Salvar
          </Button>
          <Button onClick={() => {
            setSelectedWorkOrder(null);
            setIsDrawerOpen(true);
          }}>
            Novo Trabalho
          </Button>
        </div>
      </div>

      {/* Work Orders Table */}
      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 text-left font-normal">Data In</th>
              <th className="px-4 py-3 text-left font-normal">FO</th>
              <th className="px-4 py-3 text-left font-normal">Designer</th>
              <th className="px-4 py-3 text-left font-normal">Nome Campanha</th>
              <th className="px-4 py-3 text-left font-normal">Status</th>
              <th className="px-4 py-3 text-left font-normal">Data Saída</th>
              <th className="px-4 py-3 text-center font-normal">Prioridade</th>
              <th className="px-4 py-3 text-right font-normal">Ações</th>
            </tr>
          </thead>
          <tbody>
            {workOrders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="px-4 py-3">{new Date(order.data_in).toLocaleDateString()}</td>
                <td className="px-4 py-3">{order.numero_fo}</td>
                <td className="px-4 py-3">{order.profiles?.first_name}</td>
                <td className="px-4 py-3">{order.nome_campanha}</td>
                <td className="px-4 py-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-black rounded-full h-2" 
                      style={{ width: `${calculateProgress(order)}%` }}
                    />
                  </div>
                </td>
                <td className="px-4 py-3">{order.data_saida ? new Date(order.data_saida).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3 text-center">
                  {order.prioridade && (
                    <div className="w-3 h-3 bg-red-500 rounded-sm mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedWorkOrder(order);
                        setIsDrawerOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Work Order Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="dark:bg-[#121212] bg-white dark:text-white text-black h-[85vh] overflow-y-auto">
          <div className="p-4">
            <h2 className="text-base font-normal mb-4">Novo Trabalho</h2>
            
            <div className="flex gap-4 mb-4">
              <div className="w-[100px] flex-shrink-0">
                <label className="text-sm dark:text-gray-400 text-gray-600">FO</label>
                <Input 
                  value={newWorkOrder.fo}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                    setNewWorkOrder(prev => ({ ...prev, fo: value }))
                  }}
                  className="dark:bg-[#1A1A1A] bg-gray-50 dark:border-0 border dark:text-white text-black"
                  placeholder="1045"
                  maxLength={5}
                />
              </div>
              <div className="flex-1">
                <label className="text-sm dark:text-gray-400 text-gray-600">Nome Campanha</label>
                <Input 
                  value={newWorkOrder.nome_campanha}
                  onChange={(e) => setNewWorkOrder(prev => ({ ...prev, nome_campanha: e.target.value }))}
                  className="dark:bg-[#1A1A1A] bg-gray-50 dark:border-0 border dark:text-white text-black w-full"
                  placeholder="Nome Campanha"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm dark:text-gray-400 text-gray-600">Notas</label>
              <Textarea
                value={newWorkOrder.notas || ''}
                onChange={(e) => setNewWorkOrder(prev => ({ ...prev, notas: e.target.value }))}
                className="dark:bg-[#1A1A1A] bg-gray-50 dark:border-0 border dark:text-white text-black min-h-[60px]"
                placeholder="Notas gerais do trabalho..."
              />
            </div>

            <div className="flex justify-between mb-4">
              <Button 
                onClick={handleAddItem}
                className="bg-[#F59E0B] text-black hover:bg-[#F59E0B]/90"
              >
                Adicionar Items
              </Button>
              <Button 
                className="bg-[#F59E0B] text-black hover:bg-[#F59E0B]/90"
              >
                Salvar
              </Button>
            </div>

            <div className="border dark:border-gray-800 border-gray-200 rounded overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 dark:bg-[#121212] bg-white">
                  <tr className="border-b dark:border-gray-800 border-gray-200">
                    <th className="p-2 text-left font-normal text-sm dark:text-gray-400 text-gray-600 w-[35%]">Item</th>
                    <th className="p-2 text-left font-normal text-sm dark:text-gray-400 text-gray-600 w-[15%]">Código</th>
                    <th className="p-2 text-center font-normal text-sm dark:text-gray-400 text-gray-600 w-[40px]">C</th>
                    <th className="p-2 text-center font-normal text-sm dark:text-gray-400 text-gray-600 w-[40px]">D</th>
                    <th className="p-2 text-center font-normal text-sm dark:text-gray-400 text-gray-600 w-[40px]">M</th>
                    <th className="p-2 text-center font-normal text-sm dark:text-gray-400 text-gray-600 w-[40px]">P</th>
                    <th className="p-2 text-left font-normal text-sm dark:text-gray-400 text-gray-600 w-[100px]">Data Saída</th>
                    <th className="p-2 text-left font-normal text-sm dark:text-gray-400 text-gray-600 w-[25%]">Path</th>
                    <th className="p-2 text-center font-normal text-sm dark:text-gray-400 text-gray-600 w-[60px]">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {newWorkItems.map((item, index) => (
                    <tr key={item.id} className="border-b dark:border-gray-800 border-gray-200">
                      <td className="p-2">
                        <Input
                          value={item.descricao}
                          onChange={(e) => handleItemChange(index, 'descricao', e.target.value)}
                          className="dark:bg-[#1A1A1A] bg-gray-50 dark:border-0 border dark:text-white text-black w-full"
                          placeholder="HPT00104631 ABRIL- SAGRES - REPETICAO - Forra Ilha ½ palete"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={item.codigo || ''}
                          onChange={(e) => handleItemChange(index, 'codigo', e.target.value)}
                          className="dark:bg-[#1A1A1A] bg-gray-50 dark:border-0 border dark:text-white text-black w-full"
                          placeholder="CM SCC0134"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex justify-center">
                          <div className={`w-5 h-5 flex items-center justify-center rounded border-2 cursor-pointer ${item.em_curso ? 'bg-[#F59E0B] border-[#F59E0B]' : 'dark:border-gray-600 border-gray-400 bg-transparent'}`} onClick={() => handleItemChange(index, 'em_curso', !item.em_curso)}>
                            {item.em_curso && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex justify-center">
                          <div className={`w-5 h-5 flex items-center justify-center rounded border-2 cursor-pointer ${item.duvidas ? 'bg-[#F59E0B] border-[#F59E0B]' : 'dark:border-gray-600 border-gray-400 bg-transparent'}`} onClick={() => handleItemChange(index, 'duvidas', !item.duvidas)}>
                            {item.duvidas && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex justify-center">
                          <div className={`w-5 h-5 flex items-center justify-center rounded border-2 cursor-pointer ${item.maquete_enviada ? 'bg-[#F59E0B] border-[#F59E0B]' : 'dark:border-gray-600 border-gray-400 bg-transparent'}`} onClick={() => handleItemChange(index, 'maquete_enviada', !item.maquete_enviada)}>
                            {item.maquete_enviada && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex justify-center">
                          <div className={`w-5 h-5 flex items-center justify-center rounded border-2 cursor-pointer ${item.paginacao ? 'bg-[#F59E0B] border-[#F59E0B]' : 'dark:border-gray-600 border-gray-400 bg-transparent'}`} onClick={() => handleItemChange(index, 'paginacao', !item.paginacao)}>
                            {item.paginacao && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                        </div>
                      </td>
                      <td className="p-2 dark:text-gray-400 text-gray-600">{item.data_saida || '-'}</td>
                      <td className="p-2">
                        <Input
                          value={item.path_trabalho || ''}
                          onChange={(e) => handleItemChange(index, 'path_trabalho', e.target.value)}
                          className="dark:bg-[#1A1A1A] bg-gray-50 dark:border-0 border dark:text-white text-black w-full"
                          placeholder="D:/Central/Sagres/..."
                        />
                      </td>
                      <td className="p-2">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(index)}
                            className="hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="dark:bg-[#1A1A1A] bg-white dark:text-white text-black">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white text-black">Confirmar eliminação</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400 text-gray-600">
              Esta ação vai eliminar permanentemente a linha
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">CANCELAR</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => itemToDelete !== null && handleDeleteItem(itemToDelete)}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              SIM
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function calculateProgress(order: WorkOrder): number {
  if (!order.items || order.items.length === 0) return 0;
  
  const completedSteps = order.items.reduce((acc, item) => {
    let steps = 0;
    if (item.em_curso) steps++;
    if (item.duvidas) steps++;
    if (item.maquete_enviada) steps++;
    if (item.paginacao) steps++;
    return acc + steps;
  }, 0);
  
  const totalPossibleSteps = order.items.length * 4;
  return Math.round((completedSteps / totalPossibleSteps) * 100);
}