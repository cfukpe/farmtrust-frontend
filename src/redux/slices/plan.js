import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    plan: '',
    tenure: 0,
    startDate: '',
    endDate: '',
}

const slice = createSlice({
    name: "planSlice",
    initialState,
    reducers: {
        selectPlan(state, action) {
            state.plan = action.payload
        }
    }
})

export default slice.reducer;

export const { selectPlan } = slice.actions