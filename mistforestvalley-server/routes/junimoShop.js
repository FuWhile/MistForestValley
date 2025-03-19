const express = require("express");
const db = require("../db");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * 获取祝尼魔商店物品
 */
router.get("/shop", verifyToken, (req, res) => {
    if (req.user.role !== "junimo") {
        return res.status(403).json({ error: "无权限" });
    }

    db.all(
        "SELECT npc_shops.*, items.name, items.price FROM npc_shops JOIN items ON npc_shops.item_id = items.id WHERE npc_shops.npc_id = ?",
        [req.user.id],
        (err, rows) => {
            if (err) return res.status(500).json({ error: "数据库查询失败" });
            res.json(rows);
        }
    );
});

/**
 * 购买物品（使用葡萄干）
 */
router.post("/buy", verifyToken, (req, res) => {
    const { item_id } = req.body;
    if (!item_id) {
        return res.status(400).json({ error: "缺少物品 ID" });
    }

    db.get("SELECT price FROM items WHERE id = ?", [item_id], (err, item) => {
        if (err || !item) return res.status(500).json({ error: "物品不存在" });

        db.run("UPDATE users SET raisins = raisins - ? WHERE id = ?", [item.price, req.user.id], (err) => {
            if (err) return res.status(500).json({ error: "购买失败" });
            db.run("INSERT INTO user_items (user_id, item_id) VALUES (?, ?)", [req.user.id, item_id]);
            res.json({ success: true, message: "购买成功" });
        });
    });
});

/**
 * 获取农夫好感度
 */
router.get("/farmers", verifyToken, (req, res) => {
    db.all("SELECT users.id, users.username, npc_affection.affection FROM users LEFT JOIN npc_affection ON users.id = npc_affection.farmer_id WHERE users.role = 'farmer'", [], (err, rows) => {
        if (err) return res.status(500).json({ error: "数据库查询失败" });
        res.json(rows);
    });
});

/**
 * 更新农夫好感度
 */
router.post("/update-affection", verifyToken, (req, res) => {
    const { farmer_id, affection } = req.body;
    if (!farmer_id || affection === undefined) {
        return res.status(400).json({ error: "缺少必要参数" });
    }

    db.run("INSERT INTO npc_affection (npc_id, farmer_id, affection) VALUES (?, ?, ?) ON CONFLICT(npc_id, farmer_id) DO UPDATE SET affection = ?", 
        [req.user.id, farmer_id, affection, affection],
        (err) => {
            if (err) return res.status(500).json({ error: "更新失败" });
            res.json({ success: true, message: "好感度已更新" });
        }
    );
});

module.exports = router;
