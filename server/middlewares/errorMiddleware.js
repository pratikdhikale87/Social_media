// unsupported end points handler 
const notFound = (req, res, next) =>{
     const error = new Error(`Not Found- ${req.originalUrl}`);
     res.status(404);
     next(error);
}

// handling the  server problem 

const errorHandler = (error, req, res, next) =>{
     if (res.headersSent) return next(error);

     //otherwise 
     res.status(error.code || 500).json({message : error.message || "An Unknown error occured"}) ;


}

// now exporting modules

module.exports = {notFound, errorHnadler: errorHandler};
