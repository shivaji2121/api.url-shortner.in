"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const links_controller_1 = __importDefault(require("../controllers/links.controller"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const linksController = new links_controller_1.default();
router.post("/", linksController.createLink);
exports.default = router;
