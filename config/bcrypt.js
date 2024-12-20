const bcrypt = require("bcrypt");

class Hash {
    constructor() {}
    // Method to hash the password
    async generateHash(Password, saltRounds = 10) {
        try {
            const hashPassword = await bcrypt.hash(Password, saltRounds);
            return hashPassword;
        } catch (err) {
            throw new Error(`Error hashing password: ${err.message}`);
        }
    }

    // Method to compare a password with a hash
    async compareHash(Password, hashPassword) {
        try {
            const isMatch = await bcrypt.compare(Password, hashPassword);
            return isMatch;
        } catch (err) {
            throw new Error(`Error comparing hash: ${err.message}`);
        }
    }
}

module.exports = Hash;
