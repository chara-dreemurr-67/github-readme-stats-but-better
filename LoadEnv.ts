import dotenv from "dotenv";

dotenv.config();

export default {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN ?? "",
    GITHUB_USERNAME: process.env.GITHUB_USERNAME ?? ""
};