const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const bcrypt = require("bcrypt");
const db = require("../db"); // 连接数据库

const router = express.Router();

router.get("/info", verifyToken, (req, res) => {
    res.json({
        success: true,
        userId: req.user.userId,
        username: req.user.username,
        role: req.user.role
    });
});

// 玩家修改密码 API
router.post("/change-password", (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    if (!username || !newPassword) {
        return res.status(400).json({ error: "用户名和新密码不能为空" });
    }

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) return res.status(500).json({ error: "服务器错误" });
        if (!user) return res.status(400).json({ error: "用户不存在" });

        if (user.password_changed === 0) {
            // 首次修改密码，无需输入旧密码
            bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
                if (err) return res.status(500).json({ error: "密码加密失败" });

                db.run("UPDATE users SET password = ?, password_changed = 1 WHERE username = ?", 
                    [hashedPassword, username], 
                    (err) => {
                        if (err) return res.status(500).json({ error: "更新密码失败" });
                        res.json({ success: true, message: "密码修改成功！" });
                    }
                );
            });
        } else {
            // 普通用户，需要验证旧密码
            if (!oldPassword) {
                return res.status(400).json({ error: "请输入旧密码进行验证" });
            }

            bcrypt.compare(oldPassword, user.password, (err, isValid) => {
                if (err) return res.status(500).json({ error: "密码验证失败" });
                if (!isValid) return res.status(403).json({ error: "旧密码错误" });

                bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
                    if (err) return res.status(500).json({ error: "密码加密失败" });

                    db.run("UPDATE users SET password = ? WHERE username = ?", 
                        [hashedPassword, username], 
                        (err) => {
                            if (err) return res.status(500).json({ error: "更新密码失败" });
                            res.json({ success: true, message: "密码修改成功！" });
                        }
                    );
                });
            });
        }
    });
});

module.exports = router;
