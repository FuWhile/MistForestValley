const express = require("express");
const db = require("../db");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * 获取 NPC 商店物品
 */
router.get("/shop/:npcId", async (req, res) => {
    const npcId = req.params.npcId;
    db.all(
        `SELECT npc_shops.item_id, items.name, npc_shops.price, npc_shops.stock 
         FROM npc_shops 
         JOIN items ON npc_shops.item_id = items.id 
         WHERE npc_id = ?`,
        [npcId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: "数据库查询失败" });
            res.json({ npc_name: `NPC_${npcId}`, items: rows, currency: "gold" });
        }
    );
});

/**
 * 购买物品
 */
router.post("/buy", verifyToken, (req, res) => {
    const { npcId, itemId } = req.body;
    const userId = req.user.id;

    db.get("SELECT money FROM users_data WHERE user_id = ?", [userId], (err, user) => {
        if (err) return res.status(500).json({ error: "数据库查询失败" });

        db.get("SELECT price, stock FROM npc_shops WHERE npc_id = ? AND item_id = ?", [npcId, itemId], (err, item) => {
            if (!item || item.stock <= 0) return res.status(400).json({ error: "库存不足" });
            if (user.money < item.price) return res.status(400).json({ error: "金币不足" });

            db.run("UPDATE users_data SET money = money - ? WHERE user_id = ?", [item.price, userId]);
            db.run("UPDATE user_items SET quantity = quantity + 1 WHERE user_id = ? AND item_id = ?", [userId, itemId]);
            db.run("UPDATE npc_shops SET stock = stock - 1 WHERE npc_id = ? AND item_id = ?", [npcId, itemId]);

            res.json({ success: true, message: "购买成功" });
        });
    });
});

module.exports = router;
