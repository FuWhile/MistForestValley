//include---------------------------------------------------------------------------
const express = require('express');
const cors = require("cors");// 允许前端跨域请求
const jwt = require("jsonwebtoken");

const app = express();
const userRoutes = require("./routes/user"); // 玩家 API
const SECRET_KEY = "your_secret_key"; // 建议使用环境变量

app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes);

const db = require("./db"); // 连接数据库
const adminRoutes = require("./routes/admin"); // 导入管理员 API
const authRoutes = require("./routes/auth"); // 导入用户 API
console.log("✅ 已加载 auth.js");

// 加载 API 路由
app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);

// 主页
app.get("/", (req, res) => {
    res.send("欢迎来到雾森谷 : Mist Forest Valley！");
});

// 启动服务器
app.listen(5000, () => {
    console.log("🌍 MistForestValley 后端运行在 http://localhost:5000");
});
