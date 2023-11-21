import { PaginationType } from './../UI/types/types';
import { UsersModel } from './../db/db';
import { UserViewType, Users } from './../UI/types/userTypes';
import { ObjectId } from "mongodb";
import {WithId} from 'mongodb'
import add from "date-fns/add";

class UserRepositories {
	async findByLoginOrEmail(loginOrEmail: string): Promise<Users | null> {
		const user: Users | null = await UsersModel.findOne({
		  $or: [{ 'accountData.email': loginOrEmail }, { 'accountData.userName': loginOrEmail }],
		});
		return user;
	  }
	  async findUserByEmail(email: string) {
		return UsersModel.findOne({'accountData.email': email})
	  }
	  async findUserByConfirmation(code: string): Promise<Users | null> {
		const user: Users | null = await UsersModel.findOne({ 'emailConfirmation.confirmationCode': code });
		return user;
	  }
	  async updateConfirmation(_id: ObjectId) {
		const result = await UsersModel.updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}})
		return result.matchedCount === 1
	  }
	  async updateUserConfirmation(_id: ObjectId, confirmationCode: string, newExpirationDate: Date): Promise<boolean> {
		const result = await UsersModel.updateOne({_id}, {$set: {'emailConfirmation.confirmationCode': confirmationCode, 'emailConfirmation.expirationDate': newExpirationDate}})
		return result.matchedCount === 1
	  }
	  async getAllUsers(
		sortBy: string,
		sortDirection: string,
		pageNumber: string,
		pageSize: string,
		searchLoginTerm: string,
		searchEmailTerm: string 
	  ): Promise<PaginationType<UserViewType>> {
	
		// const filter: mongoose.FilterQuery<BlogViewModel> = {};
	
		const filter = {$or: [{'accountData.userName': {$regex: searchLoginTerm || '', $options: 'i'}}, {'accountData.email': {$regex: searchEmailTerm ?? '', $options: 'i'}}]};
	
		const getAllUsers = await UsersModel
		  .find(filter, { projection: { passwordHash: 0 } })
		  .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
		  .skip((+pageNumber - 1) * +pageSize)
		  .limit(+pageSize)
		  .lean();
	
		const totalCount: number = await UsersModel.countDocuments(filter);
		const pagesCount: number = await Math.ceil(totalCount / +pageSize);
		return {
			pagesCount: pagesCount,
			page: +pageNumber,
			pageSize: +pageSize,
			totalCount: totalCount,
			items: getAllUsers.map((user: Users): UserViewType  => 
			user.getViewUser())
		  }
	  }
	  async createUser(newUser: Users): Promise<Users> {
		const  updateUser = await UsersModel.insertMany([newUser])
		return newUser
	  }
	  async deleteById(id: string): Promise<boolean> {
		const deleted = await UsersModel.deleteOne({_id: new ObjectId(id)})
		return deleted.deletedCount === 1;
	  }
	  async findUserById(userId: ObjectId) :Promise<Users | null>{
		let user = await UsersModel.findOne({ _id: userId });
		  return user;
	  }
	  async deleteAll() {
		const deleteAllUsers = await UsersModel.deleteMany({})
		return deleteAllUsers.deletedCount === 1;
	  }
	  async updateUserByToken(currentUserId: ObjectId, refreshToken: string): Promise<boolean> {
		const user = await UsersModel.updateOne({_id: currentUserId}, {$push: {blackList: refreshToken}})
		return user.matchedCount === 1
	  }
	  async findUserByCode(recoveryCode: string): Promise<WithId<Users> | null> {
		return UsersModel.findOne({'emailConfirmation.confirmationCode': recoveryCode})
	  }
	  async updatePassword(id: ObjectId, newPasswordHash: string) {
		const updatePassword = await UsersModel.updateOne({_id: id}, {$unset: {'emailConfirmation.confirmationCode': 1, 'emailConfirmation.expirationDate': 1}, $set: {'accountData.passwordHash': newPasswordHash}})
		return updatePassword.matchedCount === 1
	  }
	  async passwordRecovery(id: ObjectId, recoveryCode: string): Promise<boolean> {
		const recoveryInfo = {
			['emailConfirmation.confirmationCode']: recoveryCode,
			['emailConfirmation.expirationDate']: add(new Date(), {minutes: 5})
		}
		const updateRes = await UsersModel.updateOne({_id: new ObjectId(id)}, {$set: recoveryInfo})
		return updateRes.matchedCount === 1
	  }
}


export const userRepositories = new UserRepositories()
