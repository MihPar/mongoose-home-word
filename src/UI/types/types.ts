import { Request } from "express";

export type RequestWithBody<T> = Request<{}, {}, T>;
export type RequestWithQuery<T> = Request<{}, {}, {}, T>;
export type RequestWithParams<T> = Request<T>;
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>;
export type RequestWithParamsAndQuery<T, Q> = Request<T, {}, {}, Q>;

export class PaginationType<T> {
	constructor(
		public pagesCount: number,
		public page: number,
		public pageSize: number,
		public totalCount: number,
		public items: T[]
		) {}
}

// export type PaginationType<T> = {
//   pagesCount: number;
//   page: number;
//   pageSize: number;
//   totalCount: number;
//   items: T[];
// };