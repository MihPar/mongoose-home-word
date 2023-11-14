import { Request, Response, NextFunction } from "express";
import {ValidationError, validationResult} from 'express-validator'
import { HTTP_STATUS } from "../utils";

export const errorFormater = (error: ValidationError) => {
	switch (error.type) {
	  case "field":
		return {
		  message: error.msg,
		  field: error.path,
		};
	  default:
		return {
		  message: error.msg,
		  filed: "None",
		};
	}
  };
  

export const ValueMiddleware = function(
	req: Request,
	res: Response,
	next: NextFunction
  ) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
	  const errorsMessages = errors.array({onlyFirstError: true}).map(item => {
		return errorFormater(item)
	  })
	  res.status(HTTP_STATUS.BAD_REQUEST_400).send({errorsMessages})
	  return 
	} else {
	  next();
	}
  };
  