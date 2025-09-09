import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import {
  AuthRouter,
  DialogRouter,
  TopicRouter,
  UserRouter,
} from "./routers/index.js";
import {
  AdminDialogRouter,
  AdminTopicRouter,
  AdminUserRouter,
} from "./routers/admin/index.js";
import { verifyAdmin } from "./utils/jwt.js";
import { upload } from "./config/multer.js";
import validationErrorsUpload from "./utils/validationErrorsUpload.js";

const app = express();
app.use(json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
dotenv.config();

app.use("/auth", AuthRouter);
app.use("/users", UserRouter);
app.use("/topics", TopicRouter);
app.use("/dialogs", DialogRouter);

app.use("/admin/users", verifyAdmin, AdminUserRouter);
app.use("/admin/topics", verifyAdmin, AdminTopicRouter);
app.use("/admin/dialogs", verifyAdmin, AdminDialogRouter);

app.post(
  "/upload/image",
  verifyAdmin,
  upload.single("image"),
  validationErrorsUpload,
  (req, res) => {
    res.status(200).json({
      url:
        process.env.DOMAIN +
        "/" +
        req.file.destination +
        "/" +
        req.file.filename,
    });
  }
);

app.listen(5000, (err) => {
  if (err) {
    return console.error("Server error: ", err);
  }

  console.log("Server OK");
});
