import {api_url} from '../config';
import {setAccessToken} from './access_token';

export default async () => {
    const jsonResponse = await fetch(`${api_url}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
    });

    const response = await jsonResponse.json();

    if(response.success && response.access_token)
      setAccessToken(response.access_token);
    else{
      const err =  new Error("Couldn't authenticate");
      err.status = 403
      throw err;
    }
}