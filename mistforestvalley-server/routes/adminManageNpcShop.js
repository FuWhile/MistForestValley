const express = require("express");
const db = require("../db");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * 获取所有 NPC 的商店信息（仅限管理员）
 */
router.get("/all", verifyToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "无权限" });
    }

    db.all(
        "SELECT npc_shops.*, users.username AS npc_name, items.name AS item_name, items.image_id FROM npc_shops JOIN users ON npc_shops.npc_id = users.id JOIN items ON npc_shops.item_id = items.id",
        [],
        (err, rows) => {
            if (err) return res.status(500).json({ error: "数据库查询失败" });
            res.json(rows);
        }
    );
});

/**
 * 修改 NPC 商店物品（库存 & 价格）
 */
router.post("/update", verifyToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "无权限" });
    }

    const { npc_id, item_id, stock, price } = req.body;
    if (!npc_id || !item_id || stock === undefined || price === undefined) {
        return res.status(400).json({ error: "缺少必要参数" });
    }

    db.run(
        "UPDATE npc_shops SET stock = ?, price = ? WHERE npc_id = ? AND item_id = ?",
        [stock, price, npc_id, item_id],
        (err) => {
            if (err) return res.status(500).json({ error: "修改失败" });
            res.json({ success: true, message: "商店物品已更新" });
        }
    );
});

/**
 * 从 NPC 商店中移除物品
 */
router.post("/remove", verifyToken, (req, res) => {
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
            res.json({ success: true, message: "物品已从 NPC 商店移除" });
        }
    );
});

module.exports = router;
