const Mailer = require("./SendMail.js");

// Default OTP message template
const defaultText = `Dear User,

Your OTP (One-Time Password) is: {otp}

Please use this OTP to complete your verification process. This OTP will expire in 5 minutes.

If you did not request this, please ignore this email.

Best regards,
[KhataBook]`;

class Otp {
    constructor(UserMail, SenderMail, Subject = "OTP Verification Code", Text = defaultText) {
        this.mail = new Mailer(process.env.ADMIN_EMAIL, process.env.EMAIL_PASS);
        this.UserEmail = UserMail;
        this.SenderMail = SenderMail;
        this.Subject = Subject;
        this.Text = Text; 
        this.otp = null;
        this.time = Date.now(); 
        this.id = null;
    }

    async GenerateOtp() {
        try {
            this.otp = Math.floor(100000 + Math.random() * 900000);
            this.time = Date.now(); 
            const emailText = this.Text.replace("{otp}", this.otp);
            await this.mail.SendMail(this.UserEmail, this.SenderMail, this.Subject, emailText);
        } catch (err) {
            console.error("Error generating or sending OTP:", err);
            throw new Error("Failed to generate or send OTP. Please try again later.");
        }
    }

    async VerifyOtp(UserOtp) {
        try {
            const currentTime = Date.now();
            const otpAge = (currentTime - this.time) / 1000; 

            if (otpAge > 60) { 
                throw new Error("OTP has expired. Please request a new one.");
            }

            if (UserOtp == this.otp) {
                this.id = this.generateRandomWord();
                return id; 
            } else {
                return null; 
            }

        } catch (err) {
            console.error("Error verifying OTP:", err);
            throw new Error(err.message || "OTP verification failed. Please try again.");
        }
    }
    generateRandomWord(length = 16) {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let randomWord = '';
    
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomWord += characters[randomIndex];
        }
        return randomWord;
    }
}

module.exports = Otp;
