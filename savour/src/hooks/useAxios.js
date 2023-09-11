import { useState, useEffect } from 'react';
import SavourApi from '../models/SavourApi.js';

const useAxios = (optionsObj) => {
  const [ reqData, setReqData ] = useState(null);
  const { method = null, url = null, data = null, params = null, headers = null } = optionsObj;
  // console.log("useAxios HOOK ARGS", method, url, data, params, headers);
  useEffect(() => {
    const axiosReq = async (method, url, data, params, headers) => {
      // console.log("useAxios FNC ARGS", method, url, data, params, headers);
      const req = await SavourApi.request(method, url, data, params, headers);
      setReqData(() => req.data);
      // console.log("USE AXIOS RAN", req.data);
    }

    axiosReq(method, url, data, params, headers);
  }, []);

  return [reqData, setReqData];
}

export default useAxios;