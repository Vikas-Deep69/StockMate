import axios from "axios";
export const BASE_URL = "http://localhost:7000/api";

class apiService {

  login(data) {
    return axios.post(BASE_URL + "/login", data);
  }

  shopkeeperRegister(data) {
    return axios.post(BASE_URL + "/shopkeeper/add", data);
  }

  wholesalerRegister(data) {
    return axios.post(BASE_URL + "/wholesaler/add", data);
  }


  getToken() {
    return { Authorization: sessionStorage.getItem("token") };
  }

  addCategory(data) {
    return axios.post(BASE_URL + "/category/add", data, {
      headers: this.getToken(),
    });
  }

  addProduct(data) {
    return axios.post(BASE_URL + "/product/add", data, {
      headers: this.getToken(),
    });
  }

  updateCategory(data) {
    return axios.post(BASE_URL + "/category/update", data, {
      headers: this.getToken(),
    });
  }
  updateProduct(data) {
    return axios.post(BASE_URL + "/product/update", data, {
      headers: this.getToken(),
    });
  }

  changeCategoryStatus(data) {
    return axios.post(BASE_URL + "/category/changeStatus", data, {
      headers: this.getToken(),
    });
  }

  singleCategory(data) {
    return axios.post(BASE_URL + "/category/single", data, {
      headers: this.getToken(),
    });
  }
  singleWholesaler(data) {
    return axios.post(BASE_URL + "/wholesaler/single", data, {
      headers: this.getToken(),
    });
  }
  updateWholesaler(data) {
    return axios.post(BASE_URL + "/wholesaler/update", data, {
      headers: this.getToken(),
    });
  }
  singleProduct(data) {
    return axios.post(BASE_URL + "/product/single", data, {
      headers: this.getToken(),
    });
  }
  singleShop(data) {
    return axios.post(BASE_URL + "/shopkeeper/single", data, {
      headers: this.getToken(),
    });
  }


  allCategories(data) {
    return axios.post(BASE_URL + "/category/all", data);
  }
  allProducts(data) {
    return axios.post(BASE_URL + "/product/all", data);
  }

  allWholesalers(data) {
    return axios.post(BASE_URL + "/wholesaler/all", data, {
      headers: this.getToken(),
    });
  }
  allShopkeepers(data) {
    return axios.post(BASE_URL + "/shopkeeper/all", data, {
      headers: this.getToken(),
    });
  }


  shopkeeperRequestStatus(data) {
    return axios.post(BASE_URL + "/shopkeeper/requeststatus", data, {
      headers: this.getToken(),
    });
  }
  changePassword(data) {
    return axios.post(BASE_URL + "/user/changepassword", data, {
      headers: this.getToken(),
    });
  }

  wholesalerRequestStatus(data) {
    return axios.post(BASE_URL + "/wholesaler/requeststatus", data, {
      headers: this.getToken(),
    });
  }
  shopkeeperAccountStatus(data) {
    return axios.post(BASE_URL + "/shopkeeper/changestatus", data, {
      headers: this.getToken(),
    });
  }

  wholesalerAccountStatus(data) {
    return axios.post(BASE_URL + "/wholesaler/changestatus", data, {
      headers: this.getToken(),
    });
  }


  addRequest(data) {
    return axios.post(BASE_URL + "/request/add", data, {
      headers: this.getToken(),
    });
  }

  productStatus(data) {
    return axios.post(BASE_URL + "/product/changestatus", data, {
      headers: this.getToken(),
    });
  }


  allRequests(data) {
    return axios.post(BASE_URL + "/request/all", data, {
      headers: this.getToken(),
    });
  }




  requestStatus(data) {
    return axios.post(BASE_URL + "/request/requeststatus", data, {
      headers: this.getToken(),
    });
  }
  sendMeetingLink(data) {
    return axios.post(BASE_URL + "/request/update", data, {
      headers: this.getToken(),
    });
  }

  pay(data) {
    return axios.post(BASE_URL + "/request/pay", data, {
      headers: this.getToken(),
    });
  }


  sales(data) {
    return axios.post(BASE_URL + "/sales", data, {
      headers: this.getToken(),
    });
  }
  adminDashboard(data) {
    return axios.post(BASE_URL + "/admin/dashboard", data, {
      headers: this.getToken(),
    });
  }

  wholeSalerDashboard(data) {
    return axios.post(BASE_URL + "/wholesaler/dashboard", data, {
      headers: this.getToken(),
    });
  }
  shopkeeperDashboard(data) {
    return axios.post(BASE_URL + "/shopkeeper/dashboard", data, {
      headers: this.getToken(),
    });
  }




}

export default new apiService();
