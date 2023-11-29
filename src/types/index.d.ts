import { BlogsDB } from './blogsType';
import { DBUserType } from './types';

declare global {
	namespace Express {
		export interface Request {
			user: UserDBType | null
			blog: BlogsDB | null
		}
	}
}