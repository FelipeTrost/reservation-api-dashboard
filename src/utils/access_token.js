let token;

export const setAccessToken = t => {
    token = t;
};
  
export const getAccessToken = () => {
    return token;
};