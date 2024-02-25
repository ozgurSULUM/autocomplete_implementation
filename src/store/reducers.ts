import { combineReducers } from "@reduxjs/toolkit";

import sliceReducers from "./slices";
import apiReducers from "./apis";

const reducers = combineReducers({
    ...sliceReducers,
    ...apiReducers
})

export default reducers;