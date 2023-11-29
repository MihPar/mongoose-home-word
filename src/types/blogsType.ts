import { ObjectId } from "mongodb"


export class Blogs {
	public createdAt: string
	constructor(
		public name: string,
		public description: string,
		public websiteUrl: string,
		public isMembership: boolean) {
			this.createdAt = new Date().toISOString()
		}
  };

  export class BlogsDB extends Blogs {
	public _id: ObjectId
	constructor(
		 name: string,
		 description: string,
		 websiteUrl: string,
		 isMembership: boolean) {
			super(name,
				description,
				websiteUrl,
				isMembership)
				this._id = new ObjectId()
		 }
		 getBlogsViewModel() {
			return {
				id: this._id.toString(),
				name: this.name,
				description: this.description,
				websiteUrl: this.websiteUrl,
				createdAt: this.createdAt,
				isMembership: this.isMembership
			}
		}
		 
  };

//   export type BlogsType = {
// 	_id: ObjectId
// 	name: string
// 	description: string
// 	websiteUrl: string
// 	createdAt: string
// 	isMembership: boolean
//   };