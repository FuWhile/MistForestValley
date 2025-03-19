const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");

const db = new sqlite3.Database("./mistforestvalley.db");

// 管理员账号
const adminUsername = "EricWhile";
const adminPlainPassword = "Adobe13579";
const adminRole = "admin";

// 检查管理员是否存在
db.get("SELECT * FROM users WHERE username = ?", [adminUsername], (err, row) => {
    if (err) {
        console.error("查询错误:", err.message);
    } else if (!row) {
        console.log("⚠ 管理员账号不存在，正在创建...");
        // 生成哈希密码
        bcrypt.hash(adminPlainPassword, 10, (err, hashedPassword) => {
            if (err) {
                console.error("密码加密失败:", err.message);
            } else {
                // 插入新管理员
                db.run("INSERT INTO users (username, password, role, password_changed) VALUES (?, ?, ?, 1)",
                    [adminUsername, hashedPassword, adminRole],
                    (err) => {
                        if (err) {
                            console.error("插入管理员失败:", err.message);
                        } else {
                            console.log("✅ 管理员账号创建成功！");
                        }
                    }
                );
            }
        });
    } else {
        console.log("✅ 管理员账号已存在，正在更新密码...");
        // 生成新的哈希密码
        bcrypt.hash(adminPlainPassword, 10, (err, hashedPassword) => {
            if (err) {
                console.error("密码加密失败:", err.message);
            } else {
                // 更新密码
                db.run("UPDATE users SET password = ? WHERE username = ?", [hashedPassword, adminUsername], (err) => {
                    if (err) {
                        console.error("更新密码失败:", err.message);
                    } else {
                        console.log("✅ 管理员密码已更新！");
                    }
                });
            }
        });
    }
});
