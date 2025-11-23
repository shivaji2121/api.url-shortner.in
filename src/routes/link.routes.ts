import LinksController from "../controllers/links.controller";
import express from "express";

const router = express.Router();
const linksController = new LinksController();

router.get("/all", linksController.getAllLinksPaginated);
router.get("/:code", linksController.getLinksStats);
router.get("/:code", linksController.redirect);
router.delete("/:code", linksController.deleteLink);
router.post("/", linksController.createLink);


export default router;
