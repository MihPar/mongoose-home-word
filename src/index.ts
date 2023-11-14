import { runDb } from './db/db';
import { app } from './settings';
import dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT || 3000

const starting = async () => {
	await runDb()
	app.set('trust proxy', true)
	app.listen(port, function() {
		console.log(`Server was started at port ${port}`)
	})
}

starting()