import { Filter } from 'mongodb';
import { securityDeviceRepositories } from './../DataAccessLayer/securityDevice-db-repositories';
import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../utils';
import {config} from'dotenv'
import { CollectionIP } from '../UI/types/deviceAuthSession';
config()

export const limitRequestMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const reqData: CollectionIP = {
		IP: req.ip,
		URL: req.originalUrl,
		date: new Date(),
	}
	console.log('url/endpoit: ', reqData.URL)
	await securityDeviceRepositories.createCollectionIP(reqData)
    const tenSecondsAgo = new Date(Date.now() - 10000)
    const filter: Filter<CollectionIP> = {IP: reqData.IP, URL: reqData.URL, date: {$gt: tenSecondsAgo}}

    const count = await securityDeviceRepositories.countDocs(filter)
    if (count > 5) {
		console.log("count: ", count)
        res.sendStatus(HTTP_STATUS.HTTP_STATUS_429)
		return
    } 
	next()
}