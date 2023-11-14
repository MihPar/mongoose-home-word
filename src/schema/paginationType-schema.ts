import { PaginationType } from './../UI/types/types';
import mongoose from 'mongoose'
import { WithId } from 'mongodb'

export const PaginationTypeSchema = new mongoose.Schema<WithId<PaginationType<T>>>({
	pagesCount: {type: Number, require: true},
  page: {type: Number, require: true},
  pageSize: {type: Number, require: true},
  totalCount: {type: Number, require: true}
  items: {T[]}
})