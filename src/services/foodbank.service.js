const { default: axiosInstance } = require("src/utils/axios");

class FoodBankService {
    static baseURL = '/foodbank';

    static getAllFoodBank() {
        return axiosInstance.get(this.baseURL);
    }

    static approveFoodBankSaving(id) {
        return axiosInstance.patch(`${this.baseURL}/${id}/approve`)
    }
}

export default FoodBankService;