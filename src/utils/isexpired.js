import jwt_decode from "jwt-decode";

export default jwt => {
    try {
        const {exp} = jwt_decode(jwt);
        return !exp ? true : new Date() > new Date(exp * 1000);
    } catch (error) {
        return true;
    }
}