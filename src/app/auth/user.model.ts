export class User {
    constructor(
        public email: string, 
        public id: string, 
        private _token: string, //private because the token should not be retrieved just by calling this class. but have a getter function so that the function will run first before it is returened.
        private _tokenExpirationDate: Date
    ) {}

    //getter function forces the token to be returned in a way that it will automatically check the validity of the token
    //you access getter functions like a property. so like "user.token"
    //you cannot set the token because you do not have a "setter" function. 
    get token() {
        //return the token only if the is a value for _tokenExpirationDate, meaning it's not null
        //and also that date should be less then the current date new Date(). meaning if the tokenExpirationDate is less then
        //current time,that means the token has expired and null should be returned. 
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }
        //return the token otherwise. 
        return this._token
    }
}