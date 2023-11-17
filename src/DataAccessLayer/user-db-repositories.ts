import { userService } from './../Bisnes-logic-layer/userService';
import { PaginationType } from './../UI/types/types';
import { UsersModel } from './../db/db';
import { UserType, DBUserType, UserGeneralType } from './../UI/types/userTypes';
import { Filter, ObjectId } from "mongodb";
import mongoose from "mongoose";
import {WithId} from 'mongodb'
import add from "date-fns/add";


export const userRepositories = {
  async findByLoginOrEmail(loginOrEmail: string): Promise<DBUserType | null> {
    const user: DBUserType | null = await UsersModel.findOne({
      $or: [{ 'accountData.email': loginOrEmail }, { 'accountData.userName': loginOrEmail }],
    });
    return user;
  },
  async findUserByConfirmation(code: string): Promise<DBUserType | null> {
    const user: DBUserType | null = await UsersModel.findOne({ 'emailConfirmation.confirmationCode': code });
    return user;
  },
  async updateConfirmation(_id: ObjectId) {
	const result = await UsersModel.updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}})
	return result.matchedCount === 1
  },
  async updateUserConfirmation(_id: ObjectId, confirmationCode: string, newExpirationDate: Date): Promise<boolean> {
	const result = await UsersModel.updateOne({_id}, {$set: {'emailConfirmation.confirmationCode': confirmationCode, 'emailConfirmation.expirationDate': newExpirationDate}})
	return result.matchedCount === 1
  },
  async getAllUsers(
    sortBy: string,
    sortDirection: string,
    pageNumber: string,
    pageSize: string,
    searchLoginTerm: string,
    searchEmailTerm: string 
  ): Promise<PaginationType<UserType>> {

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
        items: getAllUsers.map((user: DBUserType): UserType  => ({
			id: user._id.toString(),
			login: user.accountData.userName,
			email: user.accountData.email,
			createdAt: user.accountData.createdAt,
		})),
      }
  },
  async createUser(newUser: DBUserType): Promise<DBUserType> {
	const  updateUser = await UsersModel.insertMany([newUser])
	return newUser
  },
  async deleteById(id: string): Promise<boolean> {
	const deleted = await UsersModel.deleteOne({_id: new ObjectId(id)})
	return deleted.deletedCount === 1;
  },
  async findUserById(userId: ObjectId) :Promise<DBUserType | null>{
    let user = await UsersModel.findOne({ _id: userId });
      return user;
  },
  async deleteAll() {
	const deleteAllUsers = await UsersModel.deleteMany({})
	return deleteAllUsers.deletedCount === 1;
  },
  async updateUserByToken(currentUserId: ObjectId, refreshToken: string): Promise<boolean> {
	const user = await UsersModel.updateOne({_id: currentUserId}, {$push: {blackList: refreshToken}})
	return user.matchedCount === 1
  },
  async findUserByCode(recoveryCode: string): Promise<WithId<UserGeneralType> | null> {
	return UsersModel.findOne({'emailConfirmation.confirmationCode': recoveryCode})
  },
  async updatePassword(id: ObjectId, newPasswordHash: string) {
	const updatePassword = await UsersModel.updateOne({_id: id}, {$unset: {'emailConfirmation.confirmationCode': 1, 'emailConfirmation.expirationDate': 1}, $set: {'accountData.passwordHash': newPasswordHash}})
	return updatePassword.matchedCount === 1
  },
  async passwordRecovery(id: ObjectId, recoveryCode: string): Promise<boolean> {
	const recoveryInfo = {
		code: recoveryCode,
		exp: add(new Date(), {minutes: 5})
	}
	const updateRes = await UsersModel.updateOne({_id: id}, {$set: recoveryInfo})
	return updateRes.matchedCount === 1

  }
};
