import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  VerificationResult,
  VerificationUIState,
  VerifyTab,
} from "./verificationTypes";

const initialState: VerificationUIState = {
  activeTab: "link",
  inputValue: "",
  verifyStatus: "idle",
  errorMessage: "",
  result: null,
  isCameraActive: false,
  selectedDevice: null,
  isPaused: false,
  scannerError: null,
};

const verificationSlice = createSlice({
  name: "verificationUI",
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<VerifyTab>) {
      state.activeTab = action.payload;
    },
    setInputValue(state, action: PayloadAction<string>) {
      state.inputValue = action.payload;
    },
    setCameraActive(state, action: PayloadAction<boolean>) {
      state.isCameraActive = action.payload;
    },
    setSelectedDevice(state, action: PayloadAction<string | null>) {
      state.selectedDevice = action.payload;
    },
    setPaused(state, action: PayloadAction<boolean>) {
      state.isPaused = action.payload;
    },
    setScannerError(state, action: PayloadAction<string | null>) {
      state.scannerError = action.payload;
    },
    verifyStart(state) {
      state.verifyStatus = "verifying";
      state.errorMessage = "";
      state.result = null;
    },
    verifySuccess(state, action: PayloadAction<VerificationResult>) {
      state.verifyStatus = "success";
      state.result = action.payload;
      state.errorMessage = "";
    },
    verifyFailure(state, action: PayloadAction<string>) {
      state.verifyStatus = "error";
      state.errorMessage = action.payload;
      state.result = null;
    },
    reset(state) {
      state.verifyStatus = "idle";
      state.errorMessage = "";
      state.result = null;
      state.inputValue = "";
      state.isCameraActive = false;
      state.isPaused = false;
      state.scannerError = null;
      // Note: activeTab and selectedDevice are intentionally left as-is,
      // since Verify.tsx calls reset() on every tab switch and we don't
      // want to fight that by resetting the tab itself.
    },
  },
});

export const {
  setActiveTab,
  setInputValue,
  setCameraActive,
  setSelectedDevice,
  setPaused,
  setScannerError,
  verifyStart,
  verifySuccess,
  verifyFailure,
  reset,
} = verificationSlice.actions;

export default verificationSlice.reducer;
