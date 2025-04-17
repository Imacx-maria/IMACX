'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  numero_fo: string;
  nome_campanha: string;
  prioridade: boolean;
  observacoes: string;
  items: Array<{
    id: string;
    paginacao: string;
    selected: boolean;
  }>;
}

export default function NewWorkOrderPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    numero_fo: '',
    nome_campanha: '',
    prioridade: false,
    observacoes: '',
    items: []
  });

  React.useEffect(() => {
    // Fetch available items when component mounts
    async function fetchItems() {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('paginacao', { ascending: true });

      if (error) {
        console.error('Error fetching items:', error);
        return;
      }

      setFormData(prev => ({
        ...prev,
        items: data.map(item => ({
          ...item,
          selected: false
        }))
      }));
    }

    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create work order
      const { data: workOrder, error: workOrderError } = await supabase
        .from('folhas_obras')
        .insert({
          numero_fo: formData.numero_fo,
          nome_campanha: formData.nome_campanha,
          prioridade: formData.prioridade,
          observacoes: formData.observacoes,
          user_id: user?.id
        })
        .select()
        .single();

      if (workOrderError) throw workOrderError;

      // Link selected items to work order
      const selectedItems = formData.items.filter(item => item.selected);
      if (selectedItems.length > 0) {
        const { error: itemsError } = await supabase
          .from('items')
          .insert(
            selectedItems.map(item => ({
              folha_obra_id: workOrder.id,
              descricao: item.paginacao,
              paginacao: false, // Default value for new items
              em_curso: false,  // Default value for new items
              data_in: new Date().toISOString(),
              codigo: '',       // Empty string for codigo field
              duvidas: false    // Default value for duvidas field
            }))
          );

        if (itemsError) throw itemsError;
      }

      router.push('/designer-flow');
    } catch (error) {
      console.error('Error creating work order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    }));
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">New Work Order</h1>
        <div className="space-x-4">
          <Button 
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button 
            variant="default"
            onClick={() => setShowDrawer(true)}
          >
            Select Items
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create Work Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="numero_fo">FO Number</Label>
                <Input
                  id="numero_fo"
                  value={formData.numero_fo}
                  onChange={(e) => setFormData(prev => ({ ...prev, numero_fo: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome_campanha">Campaign Name</Label>
                <Input
                  id="nome_campanha"
                  value={formData.nome_campanha}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome_campanha: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="prioridade"
                checked={formData.prioridade}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, prioridade: checked as boolean }))
                }
              />
              <Label htmlFor="prioridade">High Priority</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Notes</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Selected Items</Label>
              <div className="border rounded-md p-4">
                {formData.items.filter(item => item.selected).length === 0 ? (
                  <p className="text-muted-foreground">No items selected</p>
                ) : (
                  <ul className="space-y-2">
                    {formData.items
                      .filter(item => item.selected)
                      .map(item => (
                        <li key={item.id} className="flex items-center justify-between">
                          <span>{item.paginacao}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleItem(item.id)}
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Work Order'}
            </Button>
          </CardContent>
        </Card>
      </form>

      <Sheet open={showDrawer} onOpenChange={setShowDrawer}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Select Items</SheetTitle>
            <SheetDescription>
              Choose the items to include in this work order
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-200px)] mt-6">
            <div className="space-y-4">
              {formData.items.map(item => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={item.selected}
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                  <Label htmlFor={`item-${item.id}`}>{item.paginacao}</Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
} 