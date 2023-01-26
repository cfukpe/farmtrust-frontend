const { default: axiosInstance } = require("src/utils/axios");

class SavingService {
    static baseURL = '/savings';

    static getAllSaving() {
        return axiosInstance.get(this.baseURL);
    }

    static approveSaving(id) {
        return axiosInstance.patch(`${this.baseURL}/${id}/approve`)
    }

    static getAgentSavings(user_id) {
        return axiosInstance.get(`${this.baseURL}/agent/${user_id}`)
    }

    static agentUploadSaving(payload) {
        return axiosInstance.post(`${this.baseURL}/agent`, payload);
    }
}

export default SavingService;