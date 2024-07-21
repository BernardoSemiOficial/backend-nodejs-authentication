import { Request } from "express";
import { Query } from "express-serve-static-core";

export interface TypedRequestBody<B> extends Request {
  body: B;
}

export interface TypedRequestQuery<Q extends Query> extends Request {
  query: Q;
}

export interface TypedRequest<B, Q extends Query> extends Request {
  body: B;
  query: Q;
}
