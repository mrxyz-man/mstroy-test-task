<template>
  <div
    style="height: 100%;"
  >
    <AgGridVue
      :row-data="rowData"
      :column-defs="columnDefs"
      :tree-data="true"
      :get-data-path="getDataPath"
      :group-default-expanded="0"
      tree-data-display-type="custom"
      style="width: 100%; height: 100vh"
      @row-group-opened="refreshRowNumbers"
    />
  </div>
</template>

<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3';
import type {
  ColDef,
  GetDataPath,
  ModelUpdatedEvent,
  RowGroupOpenedEvent,
} from 'ag-grid-community';
import {
  AllCommunityModule,
  ModuleRegistry,
} from 'ag-grid-community';
import { TreeDataModule } from 'ag-grid-enterprise';
import { TreeStore } from '@/models/tree-store';
import type { Item } from '@/models/item/types';

ModuleRegistry.registerModules([
  AllCommunityModule,
  TreeDataModule,
]);

const treeStoreData = new TreeStore([
  { id: 1, parent: null, label: "Айтем 1" },
  { id: "91064cee", parent: 1, label: "Айтем 2" },
  { id: 3, parent: 1, label: "Айтем 3" },
  { id: 4, parent: "91064cee", label: "Айтем 4" },
  { id: 5, parent: "91064cee", label: "Айтем 5" },
  { id: 6, parent: "91064cee", label: "Айтем 6" },
  { id: 7, parent: 4, label: "Айтем 7" },
  { id: 8, parent: 4, label: "Айтем 8" },
]);

const rowData: Item[] = treeStoreData.getAll();

const getDataPath: GetDataPath<Item> = (data) => {
  return treeStoreData
    .getAllParents(data.id)
    .reverse()
    .map((item) => String(item.label));
};

const columnDefs: ColDef<Item>[] = [
  {
    colId: "rowNumber",
    field: "id",
    headerName: "№ п\\п",
    width: 120,
    valueGetter: (params) => {
      if (params.node?.rowIndex == null) return "";
      return params.node.rowIndex + 1;
    },
  },
  {
    field: "parent",
    headerName: "Категория",
    minWidth: 320,
    showRowGroup: true,
    cellRenderer: "agGroupCellRenderer",
    cellRendererParams: {
      suppressCount: true,
    },
    valueGetter: (params) => {
      if (!params.data) return "";
      const children = treeStoreData.getChildren(params.data.id);
      const isGroup = children && children.length > 0;
      return isGroup ? "Группа" : "Элемент";
    },
  },
  {
    field: "label",
    headerName: "Наименование",
    flex: 1,
  },
];

const refreshRowNumbers = (event: ModelUpdatedEvent<Item> | RowGroupOpenedEvent<Item>) => {
  event.api.refreshCells({
    columns: ["rowNumber"],
    force: true,
  });
}
</script>
