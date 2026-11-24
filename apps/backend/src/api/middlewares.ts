import {
  defineMiddlewares,
  validateAndTransformQuery,
  validateAndTransformBody,
} from "@medusajs/framework/http";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";

import {
  PostCreateInquiry,
  PatchHandledInquiry,
} from "../api/admin/inquiries/validators";
import { PatchTodo, PostCreateTodo } from "../api/admin/todo/validators";
import { PatchNotes, PostCreateNotes } from "../api/admin/notes/validators";
import { PostAddFeeToCartBody } from "./store/cart-fee/validators";

export const GetInquiriesSchema = createFindParams();
export const GetTodosSchema = createFindParams();

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/cart-fee",
      method: "POST",
      middlewares: [validateAndTransformBody(PostAddFeeToCartBody)],
    },
    {
      matcher: "/store/inquiries",
      method: "POST",
      middlewares: [validateAndTransformBody(PostCreateInquiry)],
    },
    {
      matcher: "/admin/inquiries",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetInquiriesSchema, {
          defaults: [
            "id",
            "handled",
            "name",
            "email",
            "phone",
            "subject",
            "content",
            "created_at",
          ],
          isList: true,
        }),
      ],
    },
    {
      matcher: "/admin/inquiries/:id",
      method: "DELETE",
      middlewares: [],
    },
    {
      matcher: "/admin/inquiries/:id",
      method: "PATCH",
      middlewares: [validateAndTransformBody(PatchHandledInquiry)],
    },
    {
      matcher: "/admin/todo",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetTodosSchema, {
          defaults: [
            "id",
            "content",
            "important",
            "done",
            "deleted",
            "created_at",
            "updated_at",
            "deleted_at",
          ],
          isList: true,
        }),
      ],
    },
    {
      matcher: "/admin/todo",
      method: "POST",
      middlewares: [validateAndTransformBody(PostCreateTodo)],
    },
    {
      matcher: "/admin/todo/:id",
      method: "DELETE",
      middlewares: [],
    },
    {
      matcher: "/admin/todo/:id",
      method: "PATCH",
      middlewares: [validateAndTransformBody(PatchTodo)],
    },
    {
      matcher: "/admin/notes",
      method: "POST",
      middlewares: [validateAndTransformBody(PostCreateNotes)],
    },
    {
      matcher: "/admin/notes/:id",
      method: "PATCH",
      middlewares: [validateAndTransformBody(PatchNotes)],
    },
  ],
});
