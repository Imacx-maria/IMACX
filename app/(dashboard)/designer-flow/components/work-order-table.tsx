'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DesignerInfo, WorkOrderWithDetails } from '../actions'; // Import types from actions
import { Edit2, Trash2 } from 'lucide-react'; // Icons

// Define props for the component
interface WorkOrderTableProps {
  workOrders: WorkOrderWithDetails[];
  designers: DesignerInfo[];
  onEditWorkOrder: (workOrder: WorkOrderWithDetails) => void; // Trigger sheet opening
  onDeleteWorkOrder: (id: string) => void; // Trigger delete action
  onInlineUpdate: (id: string, data: Partial<Pick<WorkOrderWithDetails, 'profile_id' | 'nome_campanha' | 'prioridade'>>) => void; // Handle inline changes
  isLoading: boolean; // To show loading state
}

export function WorkOrderTable({
  workOrders,
  designers,
  onEditWorkOrder,
  onDeleteWorkOrder,
  onInlineUpdate,
  isLoading,
}: WorkOrderTableProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        // hour: '2-digit',
        // minute: '2-digit',
      });
    } catch (e) {
      return '-';
    }
  };

  const handleInlineChange = (id: string, field: keyof Pick<WorkOrderWithDetails, 'profile_id' | 'nome_campanha' | 'prioridade'>, value: any) => {
    onInlineUpdate(id, { [field]: value });
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Data In</TableHead>
              <TableHead className="w-[80px]">FO</TableHead>
              <TableHead className="w-[150px]">Designer</TableHead>
              <TableHead>Nome Campanha</TableHead>
              <TableHead className="w-[150px]">Status</TableHead>
              <TableHead className="w-[100px]">Data Saída</TableHead>
              <TableHead className="w-[80px] text-center">Prioridade</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Loading work orders...
                </TableCell>
              </TableRow>
            ) : workOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No work orders found.
                </TableCell>
              </TableRow>
            ) : (
              workOrders.map((wo) => (
                <TableRow key={wo.id}>
                  <TableCell className="font-medium">{formatDate(wo.data_in)}</TableCell>
                  <TableCell>{wo.numero_fo}</TableCell>
                  <TableCell>
                    {/* Inline Editable Designer Select */}
                    <Select
                      value={wo.profile_id ?? ''}
                      onValueChange={(value) => handleInlineChange(wo.id, 'profile_id', value || null)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Assign..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=""><em>Unassigned</em></SelectItem>
                        {designers.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.first_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {/* Inline Editable Campaign Name Input */}
                    <Input
                      value={wo.nome_campanha ?? ''}
                      onChange={(e) => handleInlineChange(wo.id, 'nome_campanha', e.target.value)}
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Progress value={wo.completion_percentage} className="w-full h-2" />
                    <span className="text-xs text-muted-foreground">{wo.completion_percentage}%</span>
                  </TableCell>
                  <TableCell>{formatDate(wo.data_saida)}</TableCell>
                  <TableCell className="text-center">
                    {/* Inline Editable Priority Checkbox */}
                    <Checkbox
                      checked={wo.prioridade ?? false}
                      onCheckedChange={(checked) => handleInlineChange(wo.id, 'prioridade', !!checked)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Action Buttons */}
                    <Button variant="ghost" size="icon" onClick={() => onEditWorkOrder(wo)} className="mr-1">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteConfirmId(wo.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Esta operação vai eliminar de forma permanente este registo. Are you sure you want to delete this work order?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmId) {
                  onDeleteWorkOrder(deleteConfirmId);
                }
                setDeleteConfirmId(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}