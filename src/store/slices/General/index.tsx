import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import Locales from "/src/constants/locales.enum";
import i18next from "/src/config/i18n";

const initialState: GeneralSlice = {
  i18n: Locales.TR,
};

const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    changeLocale(state, action: PayloadAction<Locales>) {
      state.i18n = action.payload;
      i18next.changeLanguage(action.payload);
    },
  },
});

export const { changeLocale } = generalSlice.actions;

export default generalSlice;
