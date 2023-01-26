const { default: axiosInstance } = require("src/utils/axios");

class UserService {
    static baseURL = '/user';

    static getAllUsers() {
        return axiosInstance.get(this.baseURL);
    }

    static updateUser(id, payload) {
        return axiosInstance.patch(`${this.baseURL}/${id}`, payload)
    }

    static findUserByPhoneNumber(phoneNumber) {
        return axiosInstance.get(`${this.baseURL}/search/by-phone?phone_number=${phoneNumber}`)
    }
}

export default UserService;