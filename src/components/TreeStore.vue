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
    />
  </div>
</template>

<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3";
import type {
  ColDef,
  GetDataPath,
  ICellRendererParams,
} from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { TreeDataModule } from 'ag-grid-enterprise';
import { TreeStore } from "../models/tree-store";
import type { Item } from "../models/item/types";

ModuleRegistry.registerModules([
  AllCommunityModule,
  TreeDataModule,
]);

const treeStoreData = new TreeStore([
  { id: 1, parent: null, label: "Item 1" },
  { id: "91064cee", parent: 1, label: "Item 2" },
  { id: 3, parent: 1, label: "Item 3" },
  { id: 4, parent: "91064cee", label: "Item 4" },
  { id: 5, parent: "91064cee", label: "Item 5" },
  { id: 6, parent: "91064cee", label: "Item 6" },
  { id: 7, parent: 4, label: "Item 7" },
  { id: 8, parent: 4, label: "Item 8" },
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
    field: "id",
    headerName: "№ п\\п",
    width: 120,
    // valueGetter: (params) => {
    // },
  },
  {
    field: "parent",
    headerName: "Категория",
    minWidth: 320,
    showRowGroup: true,
    cellRenderer: "agGroupCellRenderer",
    valueGetter: (params) => {
      if (!params.data) return '';
      const children = treeStoreData.getChildren(params.data.id);
      const isGroup = children && children.length > 0;
      return isGroup ? 'Группа' : 'Элемент';
    },
  },
  {
    field: "label",
    headerName: "Наименование",
    flex: 1,
  },
];
</script>
