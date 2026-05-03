class ErrorHandler extends Error{
 
    statusCode: Number;
    constructor (messsage: any, statusCode: Number){
     super(messsage);  // calling the parent class constructor
     this.statusCode = statusCode;
     Error.captureStackTrace(this, this.constructor);
    }
}

export default ErrorHandler;