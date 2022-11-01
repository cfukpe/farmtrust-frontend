const { createSlice } = require("@reduxjs/toolkit");

const investmentPackages = createSlice({
    name: 'investment-packages',
    initialState: [],
    reducers: {
        setInvestmentPackages(state, action) {
            return action.payload;
        }
    }
})

export default investmentPackages.reducer;

export const { setInvestmentPackages } = investmentPackages.actions;