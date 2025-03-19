const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * 1️⃣ **用户管理：新增用户**
 */
router.post("/create-user", verifyToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "无权限" });
    }

    const { username, password, role } = req.body;
    const allowedRoles = ["admin", "farmer", "npc", "merfolk", "junimo"];

    if (!username || !password || !role) {
        return res.status(400).json({ error: "所有字段不能为空" });
    }

    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: "角色类型不正确" });
    }

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

/**
 * 2️⃣ **用户管理：修改密码**
 */
router.post("/reset-password", verifyToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "无权限" });
    }

    const { username, newPassword } = req.body;
    if (!username || !newPassword) {
        return res.status(400).json({ error: "用户名和新密码不能为空" });
    }

    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: "密码加密失败" });

        db.run("UPDATE users SET password = ? WHERE username = ?", 
            [hashedPassword, username], 
            (err) => {
                if (err) return res.status(500).json({ error: "更新密码失败" });
                res.json({ success: true, message: `用户 ${username} 的密码已成功重置` });
            }
        );
    });
});

/**
 * 3️⃣ **物品管理：新增物品**
 */
router.post("/add-item", verifyToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "无权限" });
    }

    const { name, image_id, type, effect_hp, effect_energy, sell_price, npc_price, season, category, location, description, research, source, growth_cycle, reharvest, product, cooking_effect, recipe_items, book_content } = req.body;

    if (!name || !image_id || !type || !sell_price || !npc_price) {
        return res.status(400).json({ error: "缺少必填字段" });
    }

    db.run(
        `INSERT INTO items (name, image_id, type, effect_hp, effect_energy, sell_price, npc_price, season, category, location, description, research, source, growth_cycle, reharvest, product, cooking_effect, recipe_items, book_content)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, image_id, type, effect_hp, effect_energy, sell_price, npc_price, season, category, location, description, research, source, growth_cycle, reharvest, product, cooking_effect, recipe_items, book_content],
        (err) => {
            if (err) return res.status(500).json({ error: "添加物品失败" });
            res.json({ success: true, message: `物品 ${name} 已成功添加！` });
        }
    );
});

/**
 * 4️⃣ **用户数据管理：修改用户金币、技能**
 */
router.post("/modify-user-value", verifyToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "无权限" });
    }

    const { username, field, value } = req.body;
    const allowedFields = ["gold", "fishing_xp", "combat_xp", "farming_xp", "mining_xp", "foraging_xp"];

    if (!username || !field || value === undefined) {
        return res.status(400).json({ error: "缺少必要参数" });
    }

    if (!allowedFields.includes(field)) {
        return res.status(400).json({ error: "无效的字段" });
    }

    db.run(
        `UPDATE users SET ${field} = ? WHERE username = ?`,
        [value, username],
        (err) => {
            if (err) return res.status(500).json({ error: "更新失败" });
            res.json({ success: true, message: `用户 ${username} 的 ${field} 已更新为 ${value}` });
        }
    );
});

/**
 * 5️⃣ **NPC 商店管理：添加/修改 NPC 物品**
 */
router.post("/modify-npc-shop", verifyToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "无权限" });
    }

    const { npc_id, item_id, stock, price } = req.body;
    if (!npc_id || !item_id || stock === undefined || price === undefined) {
        return res.status(400).json({ error: "缺少必要参数" });
    }

    db.run(
        "INSERT INTO npc_shops (npc_id, item_id, stock, price) VALUES (?, ?, ?, ?) ON CONFLICT(npc_id, item_id) DO UPDATE SET stock = ?, price = ?",
        [npc_id, item_id, stock, price, stock, price],
        (err) => {
            if (err) return res.status(500).json({ error: "更新失败" });
            res.json({ success: true, message: `NPC ${npc_id} 商店物品已更新！` });
        }
    );
});

/**
 * 6️⃣ **NPC 商店管理：移除 NPC 物品**
 */
router.post("/remove-npc-item", verifyToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "无权限" });
    }

    const { npc_id, item_id } = req.body;
    if (!npc_id || !item_id) {
        return res.status(400).json({ error: "缺少物品 ID 或 NPC ID" });
    }

    db.run(
        "DELETE FROM npc_shops WHERE npc_id = ? AND item_id = ?",
        [npc_id, item_id],
        (err) => {
            if (err) return res.status(500).json({ error: "删除失败" });
            res.json({ success: true, message: `物品已从 NPC ${npc_id} 商店移除` });
        }
    );
});

module.exports = router;
