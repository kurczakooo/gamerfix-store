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

export const GetInquiriesSchema = createFindParams();

export default defineMiddlewares({
  routes: [
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
  ],
});
