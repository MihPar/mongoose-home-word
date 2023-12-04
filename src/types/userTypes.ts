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

export class Users extends DbId {
  constructor(
    public accountData: AccountDataType,
    public emailConfirmation: EmailConfirmationType
  ) {
    super();
  }
  getViewUser(): UserViewType {
    return {
      id: this._id.toString(),
      login: this.accountData.userName,
      email: this.accountData.email,
      createdAt: this.accountData.createdAt,
    };
  }
}