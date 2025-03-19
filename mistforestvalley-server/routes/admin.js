//include---------------------------------------------------------------------------
const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db"); // 导入数据库模块
const verifyToken = require("../middlewares/authMiddleware"); // 认证中间件

const router = express.Router();

// 管理员创建用户（分配账号、初始密码和角色）
router.post("/create-user", verifyToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "无权限，只有管理员可以创建用户" });
    }

    const { username, password, role } = req.body;
    const allowedRoles = ["admin", "farmer", "npc", "merfolk", "junimo"];

    if (!username || !password || !role) {
        return res.status(400).json({ error: "所有字段不能为空" });
    }

    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: "角色类型不正确" });
    }

    // 确保用户不存在
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) return res.status(500).json({ error: "服务器错误" });
        if (user) return res.status(400).json({ error: "用户名已存在" });

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ error: "密码加密失败" });

            db.run(
                "INSERT INTO users (username, password, role, password_changed) VALUES (?, ?, ?, 0)",
                [username, hashedPassword, role],
                (err) => {
                    if (err) return res.status(500).json({ error: "创建用户失败" });

                    res.json({ success: true, message: `用户 ${username} 创建成功！` });
                }
            );
        });
    });
});

// 管理员重置用户密码或者新建角色
router.post("/reset-password", verifyToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "无权限" });
    }

    const { username, newPassword, role } = req.body;
    const allowedRoles = ["admin", "farmer", "npc", "merfolk", "junimo"];

    if (!username || !newPassword) {
        return res.status(400).json({ error: "用户名和新密码不能为空" });
    }

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) return res.status(500).json({ error: "服务器错误" });

        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ error: "密码加密失败" });

            if (user) {
                // 用户已存在，更新密码
                db.run("UPDATE users SET password = ? WHERE username = ?", 
                    [hashedPassword, username], 
                    (err) => {
                        if (err) return res.status(500).json({ error: "更新密码失败" });
                        res.json({ success: true, message: `用户 ${username} 的密码已成功重置` });
                    }
                );
            } else {
                // 用户不存在，管理员必须指定角色
                if (!role || !allowedRoles.includes(role)) {
                    return res.status(400).json({ error: "用户不存在，必须指定正确的角色" });
                }

                db.run("INSERT INTO users (username, password, role, password_changed) VALUES (?, ?, ?, 0)", 
                    [username, hashedPassword, role], 
                    (err) => {
                        if (err) return res.status(500).json({ error: "创建用户失败" });
                        res.json({ success: true, message: `用户 ${username} 不存在，已自动创建，角色为 ${role}` });
                    }
                );
            }
        });
    });
});

module.exports = router;// 导出路由


