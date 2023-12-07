import { ObjectId, WithId } from "mongodb";
import { UsersModel } from "../../db/db";
import { PaginationType } from "../../types/types";
import { UserViewType, Users } from "../../types/userTypes";

export class QueryUsersRepositories {
  async findByLoginOrEmail(loginOrEmail: string): Promise<Users | null> {
    const user: Users | null = await UsersModel.findOne({
      $or: [
        { "accountData.email": loginOrEmail },
        { "accountData.userName": loginOrEmail },
      ],
    });
    return user;
  }
  async findUserByEmail(email: string) {
    return UsersModel.findOne({ "accountData.email": email });
  }
  async findUserByConfirmation(code: string): Promise<Users | null> {
    const user: Users | null = await UsersModel.findOne({
      "emailConfirmation.confirmationCode": code,
    });
    return user;
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

    const filter = {
      $or: [
        {
          "accountData.userName": {
            $regex: searchLoginTerm || "",
            $options: "i",
          },
        },
        {
          "accountData.email": { $regex: searchEmailTerm ?? "", $options: "i" },
        },
      ],
    };

    const getAllUsers = await UsersModel.find(filter, 
		//{      projection: { passwordHash: 0 },
    //}
	)
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
	  .lean()
      

    const totalCount: number = await UsersModel.countDocuments(filter);
    const pagesCount: number = await Math.ceil(totalCount / +pageSize);
    return {
      pagesCount: pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCount,
      items: getAllUsers.map((user: Users): UserViewType => ({
			id: user._id.toString(),
			login: user.accountData.userName,
			email: user.accountData.email,
			createdAt: user.accountData.createdAt,
		})),
    };
  }
  async findUserById(userId: ObjectId): Promise<Users | null> {
    let user = await UsersModel.findOne({ _id: new ObjectId(userId) });
    return user;
  }
  async findUserByCode(recoveryCode: string): Promise<WithId<Users> | null> {
    return UsersModel.findOne({
      "emailConfirmation.confirmationCode": recoveryCode,
    });
  }
}