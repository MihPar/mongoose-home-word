import { ObjectId } from 'mongodb';
import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../utils/utils';
import {config} from'dotenv'
import { CollectionIP } from '../types/deviceAuthSessionTypes';
import { IPCollectionModel } from '../db/db';
import { securityDeviceRepositories } from '../Compositions-root/securityDevice-compostition-root';
config()

export const limitRequestMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const reqData: CollectionIP = {
		_id: new ObjectId(),
		IP: req.ip,
		URL: req.originalUrl,
		date: new Date(),
	}
	await securityDeviceRepositories.createCollectionIP(reqData)
    const tenSecondsAgo = new Date(Date.now() - 10000)
    const filter = {IP: reqData.IP, URL: reqData.URL, date: {$gt: tenSecondsAgo}}

    const count = await securityDeviceRepositories.countDocs(filter)
    if (count > 5) {
		console.log("count: ", count)
        res.sendStatus(HTTP_STATUS.HTTP_STATUS_429)
		return
    } 
	next()
}

export const limitRequestMiddlewarePassword = async (req: Request, res: Response, next: NextFunction) => {
	const reqData: CollectionIP = {
		_id: new ObjectId(),
		IP: req.ip,
		URL: req.originalUrl,
		date: new Date(),
	}
	console.log('url/endpoit: ', reqData.URL)

	await IPCollectionModel.create(reqData)
    const tenSecondsAgo = new Date(Date.now() - 10000)
    const filter = {$and: [{IP: reqData.IP}, {URL: reqData.URL}, {date: {$gte: tenSecondsAgo}}]}

    const count = await IPCollectionModel.countDocuments(filter)
    if (count > 5) {
		console.log("count: ", count)
        res.sendStatus(HTTP_STATUS.HTTP_STATUS_429)
		return
    } 
	next()
}