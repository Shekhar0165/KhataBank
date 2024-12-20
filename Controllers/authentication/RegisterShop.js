const ShopKeeper = require("../../models/shopkeeper");
const Hash = require('../../config/bcrypt');
const Opt = require("../../config/GenerateOpt");
const Mailer = require("../../config/SendMail")

const vaild = ["Please Enter Name!", "Please Enter ShopName", "Please Enter Mobile Number!", "Please Enter Email!","Please Enter Password!"];


const HandleRegisterShop = async (req, res) => {
    try {
        const data = req.body;

        // Check if data exists
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).send("Please Enter data!");
        }

        // Validation
        const fields = ["Name", "ShopName", "Mobile", "Email","Password"];
        for (let j = 0; j < fields.length; j++) {
            if (!data[fields[j]]) {
                return res.status(400).send({message:vaild[j]});
            }
        }

        const hash = new Hash();
        const hashPassword = await hash.generateHash(data.Password);

        // Create a new ShopKeeper instance
        const newData = new ShopKeeper({
            Name: data.Name,
            ShopName: data.ShopName,
            Mobile: data.Mobile,
            Email: data.Email,
            Password:hashPassword
        });

        // Save to database
        await newData.save();

        // Respond with success
        res.status(201).send({ message: "ShopKeeper registered successfully!", data: newData });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error", error: err.message });
    }
};

let otp = null;

const HandleGenerateOtp = async (req, res) => {
    try {
        const { Email } = req.body;

        if (!Email) {
            return res.status(400).send({ message: "Please enter an email!" });
        }

        const FindUser = await ShopKeeper.findOne({ Email });
        if (!FindUser) {
            return res.status(400).send({ message: "User not found!" });
        }

        const senderMail = "KhataBook@gmail.com";
        otp = new Opt(Email, senderMail);

        await otp.GenerateOtp();
        res.status(200).send({ message: "OTP has been sent to your email." });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Error generating OTP.", error: err.message });
    }
};

const HandleVerifyOtp = async (req, res) => {
    try {
        const { Email, UserOtp } = req.body;

        if (!Email || !UserOtp) {
            return res.status(400).send({ message: "Please provide both email and OTP!" });
        }

        if (!otp) {
            return res.status(400).send({ message: "OTP has not been generated yet." });
        }

        const verificationID = await otp.VerifyOtp(UserOtp);
        if (verificationID != null) {
            res.status(200).send({ message: "OTP verified successfully. You can now change your password." ,id:verificationID});
        } else {
            res.status(400).send({ message: "Invalid OTP. Please try again." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Error verifying OTP.", error: err.message });
    }
};

const HandleChangePassword = async (req, res) => {
    try {
        const { Email, Password,id } = req.body;

        if (!Email) {
            return res.status(400).send({ message: "Please enter an email!" });
        }
        if (!Password) {
            return res.status(400).send({ message: "Please enter a password!" });
        }
        if(!id){
            return res.status(400).send({ message: "you don't have id You are not able to change password generate otp again" });
        }
        if(id != otp.id){
            return res.status(400).send({message:"You are vaild for changing password"})
        }
        const hash = new Hash();
        const hashPassword = await hash.generateHash(Password);

        const User = await ShopKeeper.findOneAndUpdate(
            { Email },
            { $set: { Password: hashPassword } },
            { new: true } 
        );

        if (!User) {
            return res.status(400).send({ message: "User not found!" });
        } else {
            res.status(200).send({ message: "Password changed successfully." });

            const Mail = new Mailer(process.env.ADMIN_EMAIL, process.env.EMAIL_PASS);
            const senderMail = "KhataBook@gmail.com";

            const emailText = `${User.Name} (${User.ShopName}), your password has been successfully changed.`;
            await Mail.SendMail(Email, senderMail, "Password Changed", emailText);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Password could not be changed. Please try again.", error: err.message });
    }
};

module.exports = { HandleRegisterShop,HandleGenerateOtp, HandleVerifyOtp, HandleChangePassword };
