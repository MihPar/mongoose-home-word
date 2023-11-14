import { ObjectId } from "mongodb";

export type DBUserType = {
	_id: ObjectId;
  } & UserGeneralType;

  export type UserGeneralType = {
	accountData: {
		userName: string
		email: string
		passwordHash: string
		createdAt: string
	},
	emailConfirmation: {
		confirmationCode: string
		expirationDate: Date
		isConfirmed: boolean
	},
  };
  
  export type UserType = {
	id: any;
	login: string;
	email: string;
	createdAt: string;
  };
