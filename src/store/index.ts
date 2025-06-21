// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import offersReducer from "./slices/offersSlice"
import teamReducer from "./slices/teamSLice"
import lenderLoanReducer from "./slices/lenderLoanSlice" // ✅ Import your new slice
import signupPartnerReducer from "./slices/signupPartnerSlice" // ✅ Import your new slice
import managePartnersReducer from "./slices/managePartnerSlice" // ✅ Import your new slice
import leadsReducer from "./slices/leadSLice" // ✅ Import your new slice
import associateReducer from "./slices/associateSlice" // ✅ Import your new slice
import commissionReducer from "./slices/commissionSlice" // ✅ Import your new slice
import userDataReducer from "./slices/userDataSlice" // ✅ Import userData slice
import changeRequestReducer from "./slices/changeRequestSlice" // ✅ Import changeRequest slice
import resourceAndSupportReducer from "./slices/resourceAndSupportSlice" // ✅ Import changeRequest slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    offers: offersReducer,
    team: teamReducer,
    lenderLoan: lenderLoanReducer, // ✅ Add it to the store
    signupPartner: signupPartnerReducer,
    managePartners: managePartnersReducer, // ✅ this key must match useAppSelector
    leads: leadsReducer,
    associate: associateReducer,
    commission: commissionReducer,
    userData: userDataReducer, // ✅ Add userData to the store
    changeRequest: changeRequestReducer, // ✅ Add changeRequest to the store
    resourceAndSupport: resourceAndSupportReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
