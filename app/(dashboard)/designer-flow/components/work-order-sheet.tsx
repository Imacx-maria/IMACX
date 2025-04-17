'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Trash2, Pencil } from 'lucide-react';

// --- Zod Schema Definition ---

const itemSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().min(1, 'Description is required'),
  codigo: z.string(),
  em_curso: z.boolean(),
  duvidas: z.boolean(),
  maquete_enviada: z.boolean(),
  paginacao: z.boolean(),
  path_trabalho: z.string(),
  data_saida: z.string(),
  notas: z.string(),
});

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

type WorkOrderFormData = z.infer<typeof workOrderSchema>;
type WorkOrderItem = z.infer<typeof itemSchema>;

// --- Component Props ---

interface WorkOrderSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    fo: string;
    nome_campanha: string;
    items: Partial<WorkOrderItem>[];
  };
}

// --- Component ---

export function WorkOrderSheet({ isOpen, onOpenChange, initialData }: WorkOrderSheetProps) {
  const form = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      numero_fo: initialData?.fo ? parseInt(initialData.fo) : 0,
      nome_campanha: initialData?.nome_campanha || '',
      items: (initialData?.items || []).map(item => ({
        id: item.id,
        descricao: item.descricao || '',
        codigo: item.codigo || '',
        path_trabalho: item.path_trabalho || '',
        data_saida: item.data_saida || '',
        notas: item.notas || '',
        em_curso: Boolean(item.em_curso),
        duvidas: Boolean(item.duvidas),
        maquete_enviada: Boolean(item.maquete_enviada),
        paginacao: Boolean(item.paginacao),
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const handleAddItem = () => {
    append({
      descricao: '',
      codigo: '',
      path_trabalho: '',
      data_saida: '',
      notas: '',
      em_curso: false,
      duvidas: false,
      maquete_enviada: false,
      paginacao: false,
    });
  };

  const onSubmit = async (data: WorkOrderFormData) => {
    try {
      console.log(data);
      // Here you can handle the form submission
      toast.success('Work order saved successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save work order');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="numero_fo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>FO</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="1045" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nome_campanha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Campanha</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nome Campanha" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between">
          <Button type="button" onClick={handleAddItem}>Adicionar Items</Button>
          <Button type="submit">Salvar</Button>
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
              {fields.map((field, index) => (
                <tr key={field.id} className="border-b">
                  <td className="p-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.descricao`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="HPT00104631 ABRIL- SAGRES - REPETICAO - Forra Ilha ½ palete" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="p-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.codigo`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="CM SCC0134" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="p-2 text-center">
                    <FormField
                      control={form.control}
                      name={`items.${index}.em_curso`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="p-2 text-center">
                    <FormField
                      control={form.control}
                      name={`items.${index}.duvidas`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="p-2 text-center">
                    <FormField
                      control={form.control}
                      name={`items.${index}.maquete_enviada`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="p-2 text-center">
                    <FormField
                      control={form.control}
                      name={`items.${index}.paginacao`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="p-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.data_saida`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} type="text" placeholder="04/10/2025 11:06" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="p-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.path_trabalho`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="D:/Central/Sagres/djckshvkashvlavalf/dsfadf" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="p-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.notas`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea {...field} placeholder="You are a..." className="min-h-[60px]" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="p-2">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" type="button">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
    </Form>
  );
}