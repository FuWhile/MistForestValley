const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key"; // 应该存储在环境变量中

// **JWT 令牌验证中间件**
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // 从请求头获取 Token

    if (!token) {
        return res.status(401).json({ error: "未提供 Token，访问被拒绝" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Token 无效或已过期" });
        }
        req.user = decoded; // 将解码后的用户信息存入 `req.user`
        next();
    });
};

module.exports = verifyToken;
