import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type IssueMode = "individual" | "bulk";

interface CertificateUIState {
  selectedTemplateId: string | null;
  mode: IssueMode;
  isPickerOpen: boolean;
  searchQuery: string;
}

const initialState: CertificateUIState = {
  selectedTemplateId: null,
  mode: "individual",
  isPickerOpen: false,
  searchQuery: "",
};

const certificateSlice = createSlice({
  name: "certificateUI",
  initialState,
  reducers: {
    setSelectedTemplateId: (state, action: PayloadAction<string>) => {
      state.selectedTemplateId = action.payload;
    },
    setMode: (state, action: PayloadAction<IssueMode>) => {
      state.mode = action.payload;
    },
    openTemplatePicker: (state) => {
      state.isPickerOpen = true;
    },
    closeTemplatePicker: (state) => {
      state.isPickerOpen = false;
    },
    setCertificateSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setSelectedTemplateId,
  setMode,
  openTemplatePicker,
  closeTemplatePicker,
  setCertificateSearchQuery,
} = certificateSlice.actions;

export default certificateSlice.reducer;
