'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog'; // For path input
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { X, PlusCircle, Trash2, Pencil } from 'lucide-react';
import { WorkOrderWithDetails, ItemFormData, CreateWorkOrderData, UpdateWorkOrderItemsData } from '../actions'; // Import types

// --- Zod Schema Definition ---

const itemSchema = z.object({
  id: z.string().optional(), // Optional for new items
  descricao: z.string().min(1, 'Description is required'),
  codigo: z.string().nullable().optional(),
  em_curso: z.boolean().nullable().optional(), // Rely on useForm defaultValues
  duvidas: z.boolean().nullable().optional(),
  maquete_enviada: z.boolean().nullable().optional(),
  paginacao: z.boolean().nullable().optional(),
  path_trabalho: z.string().nullable().optional(),
  data_saida: z.string().nullable().optional(),
  notas: z.string().nullable().optional(),
  // Dates are handled server-side
});

const workOrderSchema = z.object({
  id: z.string().optional(), // Present when editing
  numero_fo: z.coerce // Use coerce for number input
    .number({ invalid_type_error: 'FO must be a number' })
    .int()
    .min(0, 'FO cannot be negative')
    .max(9999, 'FO cannot exceed 9999'),
  nome_campanha: z.string().min(1, 'Campaign Name is required'),
  notas: z.string().nullable().optional(),
  items: z.array(itemSchema).min(1, 'At least one item is required'),
});

type WorkOrderFormData = z.infer<typeof workOrderSchema>;

// --- Component Props ---

interface WorkOrderItem {
  id: string;
  descricao: string;
  codigo?: string;
  em_curso: boolean;
  duvidas: boolean;
  maquete_enviada: boolean;
  paginacao: boolean;
  path_trabalho?: string;
  data_saida?: string;
  notas?: string;
}

interface WorkOrderSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    fo: string;
    nome_campanha: string;
    items: WorkOrderItem[];
  };
}

// --- Component ---

export function WorkOrderSheet({ isOpen, onOpenChange, initialData }: WorkOrderSheetProps) {
  const [workOrder, setWorkOrder] = useState({
    fo: initialData?.fo || '',
    nome_campanha: initialData?.nome_campanha || '',
  });

  const [items, setItems] = useState<WorkOrderItem[]>(
    initialData?.items || []
  );

  const handleAddItem = () => {
    const newItem: WorkOrderItem = {
      id: Math.random().toString(36).substr(2, 9),
      descricao: '',
      em_curso: false,
      duvidas: false,
      maquete_enviada: false,
      paginacao: false,
    };
    setItems([...items, newItem]);
  };

  const handleItemChange = (index: number, field: keyof WorkOrderItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setItems(updatedItems);
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fo">FO</Label>
          <Input
            id="fo"
            value={workOrder.fo}
            onChange={(e) => setWorkOrder({ ...workOrder, fo: e.target.value })}
            placeholder="1045"
          />
        </div>
        <div>
          <Label htmlFor="nome_campanha">Nome Campanha</Label>
          <Input
            id="nome_campanha"
            value={workOrder.nome_campanha}
            onChange={(e) => setWorkOrder({ ...workOrder, nome_campanha: e.target.value })}
            placeholder="Nome Campanha"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={handleAddItem}>Adicionar Items</Button>
        <Button variant="outline">Salvar</Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-2 font-normal">Item</th>
              <th className="text-left p-2 font-normal">Código</th>
              <th className="text-center p-2 font-normal">Em Curso</th>
              <th className="text-center p-2 font-normal">Dúvidas</th>
              <th className="text-center p-2 font-normal">Maquete</th>
              <th className="text-center p-2 font-normal">Paginação</th>
              <th className="text-left p-2 font-normal">Data Saída</th>
              <th className="text-left p-2 font-normal">Path</th>
              <th className="text-left p-2 font-normal">Notas</th>
              <th className="text-center p-2 font-normal">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">
                  <Input
                    value={item.descricao}
                    onChange={(e) => handleItemChange(index, 'descricao', e.target.value)}
                    placeholder="HPT00104631 ABRIL- SAGRES - REPETICAO - Forra Ilha ½ palete"
                  />
                </td>
                <td className="p-2">
                  <Input
                    value={item.codigo || ''}
                    onChange={(e) => handleItemChange(index, 'codigo', e.target.value)}
                    placeholder="CM SCC0134"
                  />
                </td>
                <td className="p-2 text-center">
                  <Checkbox
                    checked={item.em_curso}
                    onCheckedChange={(checked) => handleItemChange(index, 'em_curso', checked)}
                  />
                </td>
                <td className="p-2 text-center">
                  <Checkbox
                    checked={item.duvidas}
                    onCheckedChange={(checked) => handleItemChange(index, 'duvidas', checked)}
                  />
                </td>
                <td className="p-2 text-center">
                  <Checkbox
                    checked={item.maquete_enviada}
                    onCheckedChange={(checked) => handleItemChange(index, 'maquete_enviada', checked)}
                  />
                </td>
                <td className="p-2 text-center">
                  <Checkbox
                    checked={item.paginacao}
                    onCheckedChange={(checked) => handleItemChange(index, 'paginacao', checked)}
                  />
                </td>
                <td className="p-2">
                  {item.data_saida || '04/10/2025 11:06'}
                </td>
                <td className="p-2">
                  <Input
                    value={item.path_trabalho || ''}
                    onChange={(e) => handleItemChange(index, 'path_trabalho', e.target.value)}
                    placeholder="D:/Central/Sagres/djckshvkashvlavalf/dsfadf"
                  />
                </td>
                <td className="p-2">
                  <Textarea
                    value={item.notas || ''}
                    onChange={(e) => handleItemChange(index, 'notas', e.target.value)}
                    placeholder="You are a..."
                    className="min-h-[60px]"
                  />
                </td>
                <td className="p-2">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}