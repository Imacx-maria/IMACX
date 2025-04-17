'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { PlusCircle, Trash2, Check } from 'lucide-react';
import { WorkOrderForEditing, ItemFormData } from '../actions';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// --- Zod Schema Definition ---
// This schema matches the ItemFormData type from actions.ts
const itemSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().min(1, 'Description is required'),
  codigo: z.string().nullable().optional(),
  em_curso: z.boolean().nullable().optional(),
  duvidas: z.boolean().nullable().optional(),
  maquete_enviada: z.boolean().nullable().optional(),
  paginacao: z.boolean().nullable().optional(),
  path_trabalho: z.string().nullable().optional(),
}) satisfies z.ZodType<ItemFormData>;

const workOrderSchema = z.object({
  id: z.string().optional(),
  numero_fo: z.coerce
    .number({ invalid_type_error: 'FO must be a number' })
    .int()
    .min(0, 'FO cannot be negative')
    .max(9999, 'FO cannot exceed 9999'),
  nome_campanha: z.string().min(1, 'Campaign Name is required'),
  notas: z.string().optional(),
  items: z.array(itemSchema).min(1, 'At least one item is required'),
});

// Use Zod's inferred type with explicit ItemFormData reference
type WorkOrderFormData = z.infer<typeof workOrderSchema> & {
  items: ItemFormData[];
};

// --- Component Props ---

interface WorkOrderFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workOrderData: WorkOrderForEditing | null;
  onSubmit: (data: WorkOrderFormData) => Promise<{ success: boolean; message: string }>;
}

// --- Component ---

export function WorkOrderForm({
  isOpen,
  onOpenChange,
  workOrderData,
  onSubmit,
}: WorkOrderFormProps) {
  const isEditing = !!workOrderData;
  const [pathDialogOpen, setPathDialogOpen] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
  const [tempPath, setTempPath] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDeleteIndex, setItemToDeleteIndex] = useState<number | null>(null);

  const form = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      id: workOrderData?.id ?? undefined,
      numero_fo: workOrderData?.numero_fo ?? undefined,
      nome_campanha: workOrderData?.nome_campanha ?? '',
      notas: workOrderData?.notas ?? '',
      items: workOrderData?.items?.map(item => ({
        id: item.id,
        descricao: item.descricao,
        codigo: item.codigo,
        em_curso: item.em_curso,
        duvidas: item.duvidas,
        maquete_enviada: item.maquete_enviada,
        paginacao: item.paginacao,
        path_trabalho: item.path_trabalho,
      })) ?? [{
        descricao: '',
        codigo: null,
        em_curso: true, // Default to true for new items
        duvidas: false,
        maquete_enviada: false,
        paginacao: false,
        path_trabalho: null,
      } as ItemFormData],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  useEffect(() => {
    if (workOrderData) {
      form.reset({
        id: workOrderData.id,
        numero_fo: workOrderData.numero_fo,
        nome_campanha: workOrderData.nome_campanha ?? '',
        notas: workOrderData.notas ?? '',
        items: workOrderData.items?.map(item => ({
          id: item.id,
          descricao: item.descricao,
          codigo: item.codigo,
          em_curso: item.em_curso,
          duvidas: item.duvidas,
          maquete_enviada: item.maquete_enviada,
          paginacao: item.paginacao,
          path_trabalho: item.path_trabalho,
        })) ?? [{
          descricao: '',
          codigo: null,
          em_curso: true,
          duvidas: false,
          maquete_enviada: false,
          paginacao: false,
          path_trabalho: null,
        } as ItemFormData],
      });
    }
  }, [workOrderData, form]);

  const handleFormSubmit = async (formData: WorkOrderFormData) => {
    console.log('Submitting Form:', formData);
    
    // Ensure the data structure conforms to the ItemFormData type
    const processedItems = formData.items.map(item => {
      return {
        id: item.id,
        descricao: item.descricao,
        codigo: item.codigo ?? null,
        em_curso: item.em_curso ?? null,
        duvidas: item.duvidas ?? null,
        maquete_enviada: item.maquete_enviada ?? null,
        paginacao: item.paginacao ?? null,
        path_trabalho: item.path_trabalho ?? null,
      } as ItemFormData;
    });
    
    const processedData = {
      ...formData,
      items: processedItems,
    };

    const result = await onSubmit(processedData);
    if (result.success) {
      toast.success(result.message);
      onOpenChange(false);
    } else {
      toast.error(result.message);
    }
  };

  // Handle checkbox state changes with the required business logic
  const handleCheckboxChange = (index: number, field: 'em_curso' | 'duvidas' | 'maquete_enviada' | 'paginacao', value: boolean) => {
    // Get current values
    const currentItem = form.getValues(`items.${index}`);
    
    // Handle special cases based on business rules
    if (field === 'duvidas' && value === true) {
      // When duvidas is checked, em_curso should be automatically unchecked
      form.setValue(`items.${index}.em_curso`, false);
    }
    
    // When paginacao is checked, show path dialog
    if (field === 'paginacao' && value === true) {
      setCurrentItemIndex(index);
      setTempPath(currentItem.path_trabalho || '');
      setPathDialogOpen(true);
      return; // Don't update yet - wait for dialog result
    }
    
    // For normal cases, just update the field - ensure the value is the boolean itself or null if needed
    form.setValue(`items.${index}.${field}`, value);
  };

  // Handle path dialog confirmation
  const handlePathConfirm = () => {
    if (currentItemIndex !== null) {
      // Update both paginacao and path_trabalho
      form.setValue(`items.${currentItemIndex}.paginacao`, true);
      form.setValue(`items.${currentItemIndex}.path_trabalho`, tempPath || null);
      setPathDialogOpen(false);
      setCurrentItemIndex(null);
    }
  };

  // Handle path dialog cancellation
  const handlePathCancel = () => {
    setPathDialogOpen(false);
    setCurrentItemIndex(null);
    // Don't update the paginacao value
  };

  // Handle delete confirmation
  const handleDeleteClick = (index: number) => {
    setItemToDeleteIndex(index);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDeleteIndex !== null) {
      remove(itemToDeleteIndex);
      setDeleteDialogOpen(false);
      setItemToDeleteIndex(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDeleteIndex(null);
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[95vh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              <DrawerHeader>
                <DrawerTitle>{isEditing ? `Edit Work Order (FO: ${workOrderData?.numero_fo})` : 'New Work Order'}</DrawerTitle>
                <DrawerDescription>
                  {isEditing ? 'Update the details of the work order and its items.' : 'Create a new work order and add its initial items.'}
                </DrawerDescription>
              </DrawerHeader>

              <div className="space-y-6 p-4">
                {/* Main Work Order Fields */}
                <div className="grid grid-cols-12 gap-4">
                  <FormField
                    control={form.control}
                    name="numero_fo"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>FO Number</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            value={value ?? ''} 
                            onChange={onChange}
                            placeholder="1234" 
                            {...field} 
                            disabled={isEditing}
                            className="w-full"
                            maxLength={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nome_campanha"
                    render={({ field: { value, ...field } }) => (
                      <FormItem className="col-span-4">
                        <FormLabel>Campaign Name</FormLabel>
                        <FormControl>
                          <Input value={value ?? ''} placeholder="Campaign XYZ" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notas"
                    render={({ field: { value, ...field } }) => (
                      <FormItem className="col-span-6">
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea value={value ?? ''} placeholder="Optional notes..." {...field} className="h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Items Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Items</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({
                        descricao: '',
                        codigo: null,
                        em_curso: true,
                        duvidas: false,
                        maquete_enviada: false,
                        paginacao: false,
                        path_trabalho: null,
                      } as ItemFormData)}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>

                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[30%]">Description</TableHead>
                          <TableHead className="w-[100px]">Code</TableHead>
                          <TableHead className="w-[70px] text-center">Em Curso</TableHead>
                          <TableHead className="w-[70px] text-center">Dúvidas</TableHead>
                          <TableHead className="w-[70px] text-center">Maquete</TableHead>
                          <TableHead className="w-[70px] text-center">Paginação</TableHead>
                          <TableHead className="w-[25%]">Path</TableHead>
                          <TableHead className="w-[50px]">Del</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fields.map((field, index) => (
                          <TableRow key={field.id}>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`items.${index}.descricao`}
                                render={({ field: { value, ...field } }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input value={value ?? ''} placeholder="Item description" {...field} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`items.${index}.codigo`}
                                render={({ field: { value, onChange, ...rest } }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input 
                                        value={value ?? ''} 
                                        onChange={(e) => onChange(e.target.value || null)}
                                        placeholder="Code" 
                                        {...rest} 
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <FormField
                                control={form.control}
                                name={`items.${index}.em_curso`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="flex items-center justify-center">
                                        <div 
                                          className={`relative h-5 w-5 rounded-sm border border-gray-300 flex items-center justify-center transition-colors cursor-pointer ${field.value ? 'bg-orange-500' : 'bg-white'}`}
                                          onClick={() => handleCheckboxChange(index, 'em_curso', !field.value)}
                                        >
                                          {field.value && <Check className="h-3.5 w-3.5 text-white" />}
                                        </div>
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <FormField
                                control={form.control}
                                name={`items.${index}.duvidas`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="flex items-center justify-center">
                                        <div 
                                          className={`relative h-5 w-5 rounded-sm border border-gray-300 flex items-center justify-center transition-colors cursor-pointer ${field.value ? 'bg-orange-500' : 'bg-white'}`}
                                          onClick={() => handleCheckboxChange(index, 'duvidas', !field.value)}
                                        >
                                          {field.value && <Check className="h-3.5 w-3.5 text-white" />}
                                        </div>
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <FormField
                                control={form.control}
                                name={`items.${index}.maquete_enviada`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="flex items-center justify-center">
                                        <div 
                                          className={`relative h-5 w-5 rounded-sm border border-gray-300 flex items-center justify-center transition-colors cursor-pointer ${field.value ? 'bg-orange-500' : 'bg-white'}`}
                                          onClick={() => handleCheckboxChange(index, 'maquete_enviada', !field.value)}
                                        >
                                          {field.value && <Check className="h-3.5 w-3.5 text-white" />}
                                        </div>
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <FormField
                                control={form.control}
                                name={`items.${index}.paginacao`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="flex items-center justify-center">
                                        <div 
                                          className={`relative h-5 w-5 rounded-sm border border-gray-300 flex items-center justify-center transition-colors cursor-pointer ${field.value ? 'bg-orange-500' : 'bg-white'}`}
                                          onClick={() => handleCheckboxChange(index, 'paginacao', !field.value)}
                                        >
                                          {field.value && <Check className="h-3.5 w-3.5 text-white" />}
                                        </div>
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`items.${index}.path_trabalho`}
                                render={({ field: { value, onChange, ...rest } }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input 
                                        value={value ?? ''} 
                                        onChange={(e) => onChange(e.target.value || null)}
                                        placeholder="Path" 
                                        {...rest} 
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(index)}
                                disabled={fields.length === 1}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              <DrawerFooter className="flex-row justify-end space-x-2 pt-2">
                <Button type="submit" className="px-4">{isEditing ? 'Save Changes' : 'Create Work Order'}</Button>
                <DrawerClose asChild>
                  <Button type="button" variant="outline" className="px-4">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>

      {/* Path Input Dialog */}
      <AlertDialog open={pathDialogOpen} onOpenChange={setPathDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enter Path for Completed Work</AlertDialogTitle>
            <AlertDialogDescription>
              Please enter the file path where this completed work is stored.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              value={tempPath}
              onChange={(e) => setTempPath(e.target.value)}
              placeholder="Enter file path"
              className="w-full"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handlePathCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePathConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Esta operação vai eliminar de forma permanente este registo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}