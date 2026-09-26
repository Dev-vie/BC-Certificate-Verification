import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TemplateFilterTab } from "./templateTypes";

interface TemplateUIState {
  searchQuery: string;
  activeTab: TemplateFilterTab;
  isCreateModalOpen: boolean;
}

const initialState: TemplateUIState = {
  searchQuery: "",
  activeTab: "All",
  isCreateModalOpen: false,
};

const templateSlice = createSlice({
  name: "templateUI",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<TemplateFilterTab>) => {
      state.activeTab = action.payload;
    },
    openCreateModal: (state) => {
      state.isCreateModalOpen = true;
    },
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false;
    },
  },
});

export const {
  setSearchQuery,
  setActiveTab,
  openCreateModal,
  closeCreateModal,
} = templateSlice.actions;

export default templateSlice.reducer;
