import { Router } from "express";
import { registerUser,userLogin, userLogout,refreshAccessToken,
    changeCurrentPassword,getCurrentUser,updateAccountdetail,
    updateAvatar,updateCoverImage,getUserChannelProfile,UserwatchHistory } from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router()

router.route("/register").post(
    upload.fields([

        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }

    ]),  registerUser)
router.route("/Login").post( userLogin)
router.route("/Logout").post( verifyJWT ,userLogout)
router.route("/refresh-Accesstoken").post(refreshAccessToken)
router.route("/change-Password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-profile").patch(verifyJWT,updateAccountdetail)
router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateAvatar)
router.route("/update-coverimage").patch(verifyJWT,upload.single("/coverImage") ,updateCoverImage)
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT,UserwatchHistory)

export default router