const express = require("express")
const router = express.Router();
const { HandleRegisterShop,HandleGenerateOtp, HandleVerifyOtp, HandleChangePassword } = require("./../Controllers/authentication/RegisterShop");


router.post("/register/shop",HandleRegisterShop);
router.post("/generateotp",HandleGenerateOtp);
router.post("/verifyotp",HandleVerifyOtp);
router.put("/changepwd",HandleChangePassword)

module.exports = router;
