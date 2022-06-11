import http from "./httpCommon";


const initialValue = {
  "employees": [
    {
      "_id": "62a2cb293309d19af6d42bd3",
      "deletedAt": "1988-02-05",
      "isDeleted": true,
      "dateOfBirth": "1988-02-05",
      "dateOfEmployment": "1999-07-18",
      "homeAddress": {
        "addressLine2": "strin1g",
        "addressLine1": "strin1g",
        "ZIPCode": "22313",
        "city": "str123ing",
        "_id": "62a2cb293309d19af6d42bd4"
      },
      "phoneNumber": "+12098132694",
      "email": "topdeve2020@gmail.com",
      "name": "123123",
      "__v": 0
    },
    {
      "_id": "62a2cb593309d19af6d42bdf",
      "deletedAt": null,
      "isDeleted": false,
      "dateOfBirth": "1988-02-05",
      "dateOfEmployment": "1999-07-18",
      "homeAddress": {
        "addressLine2": "strin1g",
        "addressLine1": "strin1g",
        "ZIPCode": "22312",
        "city": "str123ing",
        "_id": "62a2cb593309d19af6d42be0"
      },
      "phoneNumber": "+12093132694",
      "email": "topdeve20201@gmail.com",
      "name": "12312331",
      "__v": 0
    },
    {
      "_id": "62a2cb8b3309d19af6d42be9",
      "deletedAt": null,
      "isDeleted": false,
      "dateOfBirth": "1988-02-05",
      "dateOfEmployment": "1999-07-18",
      "homeAddress": {
        "addressLine2": "strin1g",
        "addressLine1": "strin1g",
        "ZIPCode": "22311",
        "city": "str123ing",
        "_id": "62a2cb8b3309d19af6d42bea"
      },
      "phoneNumber": "+12193132694",
      "email": "topdev2e20201@gmail.com",
      "name": "123123321",
      "__v": 0
    },
    {
      "_id": "62a2cbe03309d19af6d42bfe",
      "deletedAt": null,
      "isDeleted": false,
      "dateOfBirth": "1988-02-05",
      "dateOfEmployment": "1999-07-18",
      "homeAddress": {
        "addressLine2": "strin1g",
        "addressLine1": "strin1g",
        "ZIPCode": "22310",
        "city": "str1233ing",
        "_id": "62a2cbe03309d19af6d42bff"
      },
      "phoneNumber": "+12193232694",
      "email": "topdev2e20221@gmail.com",
      "name": "1231233221",
      "__v": 0
    },
    {
      "_id": "62a2cbf43309d19af6d42c01",
      "deletedAt": null,
      "isDeleted": false,
      "dateOfBirth": "1988-02-05",
      "dateOfEmployment": "1999-07-18",
      "homeAddress": {
        "addressLine2": "strin1g",
        "addressLine1": "strin1g",
        "ZIPCode": "22310",
        "city": "str1233ing",
        "_id": "62a2cbf43309d19af6d42c02"
      },
      "phoneNumber": "+12493232694",
      "email": "topdev2520221@gmail.com",
      "name": "1231233421",
      "__v": 0
    }
  ],
  "count": 6
}




const getEmployees = (params) => {
  return  http.get("/employees",params);
  // return initialValue
};

const getDeletedEmployees = (params) => {
  return http.get("/employees/deleted", { params });
  // return initialValue
};


const create = (data) => {
  return http.post("/employees", data);
};

const update = (id, data) => {
  return http.patch(`/employees/${id}`, data);
};

const softRemove = (id) => {
  return http.delete(`/employees/soft-delete/${id}`);
};

const foreverRemove = (id) => {
  return http.delete(`/employees/permanent-delete/${id}`);
};


const EmployeeService = {
  getEmployees,
  getDeletedEmployees,
  create,
  update,
  softRemove,
  foreverRemove,

};

export default EmployeeService;
