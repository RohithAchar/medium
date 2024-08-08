"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBlogSchema = exports.SignUpSchema = void 0;
const zod_1 = require("zod");
exports.SignUpSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
    name: zod_1.z.string().optional(),
});
exports.CreateBlogSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string(),
});
