"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const JWT_1 = __importDefault(require("../middleware/JWT"));
const upload_1 = require("../middleware/upload");
const userController_1 = require("../Controllers/userController");
const router = (0, express_1.Router)();
router.use(JWT_1.default);
router.route('/profile')
    .get(userController_1.getProfile)
    .put(userController_1.updateProfile);
router.route('/avatar')
    .post(upload_1.uploadAvatarMiddleware, userController_1.uploadAvatar)
    .delete(userController_1.deleteAvatar);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map