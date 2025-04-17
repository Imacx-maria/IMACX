'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DesignerInfo } from '../actions'; // Assuming types might be shared or moved later

// TODO: Define proper filter state type, likely matching WorkOrderFilters from actions.ts
type FilterState = {
  showOpen: boolean;
  designerId: string;
  foNumber: string;
  itemDescription: string;
};

interface FilterControlsProps {
  designers: DesignerInfo[];
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onNewWorkOrder: () => void;
  onSaveChanges: () => void;
  hasPendingChanges: boolean;
}

export function FilterControls({
  designers,
  filters,
  onFilterChange,
  onNewWorkOrder,
  onSaveChanges,
  hasPendingChanges,
}: FilterControlsProps) {
  return (
    <div className="mb-6 p-4 border rounded-lg bg-card text-card-foreground">
      <div className="flex flex-wrap items-center gap-4">
        {/* Toggle Switch */}
        <div className="flex items-center space-x-2">
          <Switch
            id="status-toggle"
            checked={filters.showOpen}
            onCheckedChange={(checked) => onFilterChange({ showOpen: checked })}
          />
          <Label htmlFor="status-toggle">Trabalhos em aberto</Label>
        </div>

        {/* Designer Dropdown */}
        <div>
          <Select
            value={filters.designerId}
            onValueChange={(value) => onFilterChange({ designerId: value === 'all' ? '' : value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione Designer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Designers</SelectItem>
              {designers.map((designer) => (
                <SelectItem key={designer.id} value={designer.id}>
                  {designer.first_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* FO Filter */}
        <div>
          <Input
            type="text"
            placeholder="Filtrar FO"
            className="w-[150px]"
            value={filters.foNumber}
            onChange={(e) => onFilterChange({ foNumber: e.target.value })}
          />
        </div>

        {/* Item Filter */}
        <div>
          <Input
            type="text"
            placeholder="Filtrar Item"
            className="w-[180px]"
            value={filters.itemDescription}
            onChange={(e) => onFilterChange({ itemDescription: e.target.value })}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex-grow" /> {/* Spacer */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onSaveChanges}
            disabled={!hasPendingChanges}
          >
            Salvar
          </Button>
          <Button onClick={onNewWorkOrder}>Novo Trabalho</Button>
        </div>
      </div>
    </div>
  );
}