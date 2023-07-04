const { default: axiosInstance } = require("src/utils/axios");

class InvestmentService {
    static baseURL1 = '/investment-categories';
    static baseURL2 = '/investment-packages';

    static getAllInvestmentCategories() {
        return axiosInstance.get(this.baseURL1);
    }

    static getAllInvestmentPackages() {
        return axiosInstance.get(this.baseURL2);
    }

    static updateUser(id, payload) {
        return axiosInstance.patch(`${this.baseURL}/${id}`, payload)
    }

    static findUserByPhoneNumber(phoneNumber) {
        return axiosInstance.get(`${this.baseURL}/search/by-phone?phone_number=${phoneNumber}`)
    }
}

export default InvestmentService;