//include---------------------------------------------------------------------------  
const express = require("express");  
const bcrypt = require("bcryptjs");  
const jwt = require("jsonwebtoken");  
const db = require("../db"); // 导入数据库模块  

const router = express.Router();  
const SECRET_KEY = "your_secret_key"; // 建议存入环境变量  

// 用户注册--------------------------------------------------------------------------  
router.post('/register', (req, res) => {  
    const { username, password, role } = req.body;  // 添加角色字段  

    if (!username || !password || !role) {  // 检查角色是否为空  
        return res.status(400).json({ error: '用户名、密码和角色不能为空' });  
    }

    const allowedRoles = ["admin", "farmer", "npc", "merfolk", "junimo"];  // 允许的角色  
    if (!allowedRoles.includes(role)) {  
        return res.status(400).json({ error: '角色类型不正确' });  
    }

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {  
        if (err) return res.status(500).json({ error: err.message });  
        if (row) return res.status(400).json({ error: '用户名已被注册' });  

        bcrypt.hash(password, 10, (err, hashedPassword) => {  
            if (err) return res.status(500).json({ error: '密码加密失败' });  

            db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [username, hashedPassword, role], function (err) {  
                if (err) return res.status(500).json({ error: err.message });  
                res.json({ success: true, userId: this.lastID });  
            });  
        });  
    });  
});  

// 用户登录--------------------------------------------------------------------------  
router.post("/login", (req, res) => {  
    const { username, password } = req.body;  

    if (!username || !password) {  
        return res.status(400).json({ error: "用户名和密码不能为空" });  
    }  

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {  
        if (err) return res.status(500).json({ error: "服务器错误" });  
        if (!user) return res.status(400).json({ error: "用户名或密码错误" });  

        bcrypt.compare(password, user.password, (err, isValid) => {  
            if (err) return res.status(500).json({ error: "服务器错误" });  
            if (!isValid) return res.status(400).json({ error: "用户名或密码错误" });  

            if (user.password_changed === 0) {  
                return res.status(403).json({ error: "请修改密码", firstLogin: true });  
            }

            // **生成 JWT 令牌**  
            const token = jwt.sign(  
                { userId: user.id, username: user.username, role: user.role },  // 返回角色信息  
                SECRET_KEY,  
                { expiresIn: "2h" } // Token 有效期 2 小时  
            );  

            res.json({  
                success: true,  
                message: "登录成功",  
                token, // 返回 JWT 令牌  
                userId: user.id,  
                role: user.role  // 返回角色  
            });  
        });  
    });  
});  

//密码修改--------------------------------------------------------------------------  
router.patch("/change-password", (req, res) => {  
    const { username, oldPassword, newPassword } = req.body;  

    if (!username || !oldPassword || !newPassword) {  
        return res.status(400).json({ error: "用户名、旧密码和新密码不能为空" });  
    }  

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {  
        if (err) return res.status(500).json({ error: "服务器错误" });  
        if (!user) return res.status(404).json({ error: "用户不存在" });  

        bcrypt.compare(oldPassword, user.password, (err, isValid) => {  
            if (err) return res.status(500).json({ error: "服务器错误" });  
            if (!isValid) return res.status(400).json({ error: "旧密码错误" });  

            bcrypt.hash(newPassword, 10, (err, hashedPassword) => {  
                if (err) return res.status(500).json({ error: "密码加密失败" });  

                db.run("UPDATE users SET password = ?, password_changed = 1 WHERE username = ?",  
                    [hashedPassword, username],  
                    (err) => {  
                        if (err) return res.status(500).json({ error: "更新密码失败" });  

                        res.json({ success: true, message: "密码修改成功！请重新登录。" });  
                    }  
                );  
            });  
        });  
    });  
});  

module.exports = router; // 导出 router  
