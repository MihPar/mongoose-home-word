import { ObjectId } from "mongodb";

export class DbId {
	_id: ObjectId
	constructor() {
		this._id = new ObjectId()
	}
}
export type AccountDataType = {
	 		userName: string
	 		email: string
	 		passwordHash: string
	 		createdAt: string
	 	}

export type EmailConfirmationType = {
			confirmationCode: string
			expirationDate: Date
	 		isConfirmed: boolean
	 	}	

export type UserViewType = {
			id: any;
			login: string;
			email: string;
		   createdAt: string;
		  }		

export class User extends DbId{
	constructor(
		public accountData: AccountDataType, 
		public emailConfirmation: EmailConfirmationType) {
		super()
	}

	getViewUser(): UserViewType{
		return {
			id: this._id.toString(),
 			login: this.accountData.userName,
 			email: this.accountData.email,
 			createdAt: this.accountData.createdAt}
	}

}


// export type DBUserType = {
// 	_id: ObjectId;
//   } & UserGeneralType;

//   export type UserGeneralType = {
// 	accountData: {
// 		userName: string
// 		email: string
// 		passwordHash: string
// 		createdAt: string
// 	},
// 	emailConfirmation: {
// 		confirmationCode: string
// 		expirationDate: Date
// 		isConfirmed: boolean
// 	},
//   };

// export class UserType {
// 	constructor(
// 		public id: any,
// 		public login: string,
// 		public email: string,
// 		public createdAt: string
// 		){}
// }
  
  ;
