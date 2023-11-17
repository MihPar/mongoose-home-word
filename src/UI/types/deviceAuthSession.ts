import { ObjectId } from "mongodb"

export type CollectionIP = {
	_id: ObjectId
	IP?: string
	URL: string
	date: Date
}

export type DeviceModel =  {
	_id: ObjectId
    ip: string
    title: string
    deviceId: string
    userId: string
	lastActiveDate: string
}

export type DeviceViewModel =  {
    ip: string
    title: string
    deviceId: string
	lastActiveDate: string
}

