const express = require("express");
const db = require("../db");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * 获取管理员的商店
 */
router.get("/", verifyToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "无权限" });
    }

    db.all(
        "SELECT npc_shops.*, items.name, items.image_id FROM npc_shops JOIN items ON npc_shops.item_id = items.id WHERE npc_shops.npc_id = ?",
        [req.user.id],
        (err, rows) => {
            if (err) return res.status(500).json({ error: "数据库查询失败" });
            res.json(rows);
        }
    );
});

/**
 * 管理员向自己的商店添加物品
 */
router.post("/add", verifyToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "无权限" });
    }

    const { item_id, stock, price } = req.body;
    if (!item_id || !stock || !price) {
        return res.status(400).json({ error: "缺少必要参数" });
    }

    db.run(
        "INSERT INTO npc_shops (npc_id, item_id, stock, price) VALUES (?, ?, ?, ?) ON CONFLICT(npc_id, item_id) DO UPDATE SET stock = stock + ?, price = ?",
        [req.user.id, item_id, stock, price, stock, price],
        (err) => {
            if (err) return res.status(500).json({ error: "添加失败" });
            res.json({ success: true, message: "物品已添加到商店" });
        }
    );
});

/**
 * 管理员删除商店中的商品
 */
router.post("/remove", verifyToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "无权限" });
    }

    const { item_id } = req.body;
    if (!item_id) {
        return res.status(400).json({ error: "缺少物品 ID" });
    }

    db.run(
        "DELETE FROM npc_shops WHERE npc_id = ? AND item_id = ?",
        [req.user.id, item_id],
        (err) => {
            if (err) return res.status(500).json({ error: "删除失败" });
            res.json({ success: true, message: "物品已从商店移除" });
        }
    );
});

module.exports = router;
