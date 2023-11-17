import { ObjectId } from "mongodb"

export type BlackList = {
	_id: ObjectId
	refreshToken: string
}