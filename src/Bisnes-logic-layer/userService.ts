import { Users, UserViewType } from './../UI/types/userTypes';
import { userRepositories } from "../DataAccessLayer/user-db-repositories";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { emailManager } from "../manager/email-manager";
import { v4 as uuidv4 } from "uuid";
import add from "date-fns/add";
import {WithId} from 'mongodb'

class UserService {
	async createNewUser(
		login: string,
		password: string,
		email: string
	  ): Promise<UserViewType | null> {
		const passwordHash = await this._generateHash(password);
		const newUser: Users = {
		  _id: new ObjectId(),
		  accountData: {
			userName: login,
			email,
			passwordHash,
			createdAt: new Date().toISOString(),
		  },
		  emailConfirmation: {
			confirmationCode: uuidv4(),
			expirationDate: add(new Date(), {
			  hours: 1,
			  minutes: 10,
			}),
			isConfirmed: false,
		  },
		  getViewUser(): UserViewType {
			return {
			  id: this._id.toString(),
			  login: this.accountData.userName,
			  email: this.accountData.email,
			  createdAt: this.accountData.createdAt,
			};
		  }
		};
		const user: Users= await userRepositories.createUser(newUser);
		try {
		  await emailManager.sendEamilConfirmationMessage(
			user.accountData.email,
			user.emailConfirmation.confirmationCode
		  );
		} catch (error) {
		  console.log(error);
		}
		return {
		  id: user._id.toString(),
		  login: user.accountData.userName,
		  email: user.accountData.email,
		  createdAt: user.accountData.createdAt,
		};
	  }
	  async checkCridential(
		loginOrEmail: string,
		password: string
	  ): Promise<Users | null> {
		const user: Users | null = await userRepositories.findByLoginOrEmail(
		  loginOrEmail
		);
		if (!user) return null;
		const resultBcryptCompare: boolean = await bcrypt.compare(
		  password,
		  user.accountData.passwordHash
		);
		if (resultBcryptCompare !== true) return null;
		return user;
	  }
	  async _generateHash(password: string): Promise<string> {
		const hash: string = await bcrypt.hash(password, 3);
		return hash;
	  }
	  async deleteUserId(id: string): Promise<boolean> {
		const deleteId: boolean = await userRepositories.deleteById(id);
		return deleteId;
	  }
	  async findUserById(userId: ObjectId): Promise<Users | null> {
		return await userRepositories.findUserById(userId);
	  }
	  async deleteAllUsers() {
		return await userRepositories.deleteAll();
	  }
	  async findUserByConfirmationCode(code: string): Promise<boolean> {
		const user = await userRepositories.findUserByConfirmation(code);
		const result = await userRepositories.updateConfirmation(user!._id);
		return result;
	  }
	  async confirmEmail(email: string): Promise<Users | null> {
		return await userRepositories.findByLoginOrEmail(email);
	  }
	  async confirmEmailResendCode(email: string): Promise<boolean | null> {
		const user: Users | null = await userRepositories.findByLoginOrEmail(
		  email
		);
		if (!user) return null;
		if (user.emailConfirmation.isConfirmed) {
		  return null;
		}
		const newConfirmationCode = uuidv4();
		const newExpirationDate = add(new Date(), {
		  hours: 1,
		  minutes: 10,
		});
		await userRepositories.updateUserConfirmation(
		  user!._id,
		  newConfirmationCode,
		  newExpirationDate
		);
		try {
		  await emailManager.sendEamilConfirmationMessage(
			user.accountData.email,
			newConfirmationCode
		  );
		} catch (error) {
		  return null;
		}
		return true;
	  }
	  async updateUserByNewToken(currentUserId: ObjectId, refreshToken: string) {
		return await userRepositories.updateUserByToken(
		  currentUserId,
		  refreshToken
		);
	  }
	  async setNewPassword(newPassword: string, recoveryCode: string): Promise<boolean> {
		const findUserByCode = await userRepositories.findUserByCode(recoveryCode)
		if(!findUserByCode) {
			return false
		}
		if(findUserByCode.emailConfirmation.expirationDate < new Date()) {
			return false
		}
		const newPasswordHash = await this._generateHash(newPassword);
		const resultUpdatePassword = await userRepositories.updatePassword(findUserByCode._id, newPasswordHash)
		if(!resultUpdatePassword) {
			return false
		}
		return true
	  }
	  async recoveryPassword(email: string): Promise<boolean> {
		const recoveryCode = uuidv4()
			const findUser: WithId<Users> | null = await userRepositories.findUserByEmail(email)
			console.log('findUser: ', findUser)
			if (!findUser) {
				console.log('false: ', findUser)
				return false
			}
		try {
			await emailManager.sendEamilRecoveryCode(email, recoveryCode)
			await userRepositories.passwordRecovery(findUser._id, recoveryCode)
			return true
		} catch (e) {
			console.log('email: ', e)
			return false
		}
	  }
}

export const userService = new UserService()
