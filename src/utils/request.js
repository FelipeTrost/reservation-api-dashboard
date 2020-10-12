import { getAccessToken } from './access_token';
import refreshToken from './refresh_token';
import isexpired from './isexpired'

export default async (endpoint, method, params) => {
  let token = getAccessToken();
  if(isexpired(token))  await refreshToken()
  token = getAccessToken();
  
  let options;
  if(method === "GET"){
    endpoint += '?' + new URLSearchParams(params);

    options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
          'authorization':`baerer ${token}`
      }
    }
  }else{
    options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
          'authorization':`baerer ${token}`
      },
      body: JSON.stringify(params)
    }
  }

  const  response = await fetch(endpoint, options);
  if(response.status === 403){
    const err =  new Error("Couldn't authenticate");
    err.status = 403
    throw err;
  }

  return await response.json();
}