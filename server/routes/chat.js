import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addMembers,
  deleteChat,
  getChatDetails,
  getMessages,
  getMyChats,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMember,
  renameGroup,
  sendAttachments,
} from "../controllers/chat.js";
import { attachmentsMulter } from "../middlewares/multer.js";

const app = express.Router();

//authenticated routes
app.use(isAuthenticated);
app.post("/new", newGroupChat);

app.get("/my", getMyChats);
app.get("/my/groups", getMyGroups);
app.put("/addMembers", addMembers);
app.put("/removeMember", removeMember);
app.delete("/leave/:id", leaveGroup);

//sending attachments
app.post("/message", attachmentsMulter, sendAttachments);

//get messages
app.get("/message/:id",getMessages)

app.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat);

export default app;
