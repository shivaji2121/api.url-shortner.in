import LinksController from "../controllers/links.controller";
import express from "express";

const router = express.Router();
const linksController = new LinksController();

router.post("/", linksController.createLink);
router.get("/:code", linksController.redirect);

export default router;
