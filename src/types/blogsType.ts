import { ObjectId } from "mongodb"

export class Blogs {
	constructor(public _id: ObjectId,
		public name: string,
		public description: string,
		public websiteUrl: string,
		public createdAt: string,
		public isMembership: boolean) {}
  };

//   export type BlogsType = {
// 	_id: ObjectId
// 	name: string
// 	description: string
// 	websiteUrl: string
// 	createdAt: string
// 	isMembership: boolean
//   };