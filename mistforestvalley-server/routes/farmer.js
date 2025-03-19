const express = require("express");
const db = require("../db");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * 获取农夫数据（金币、葡萄干、技能经验、背包）
 */
router.get("/data", verifyToken, (req, res) => {
    if (req.user.role !== "farmer") {
        return res.status(403).json({ error: "无权限" });
    }

    // 读取金币 & 葡萄干
    db.get("SELECT money, raisins FROM users_data WHERE user_id = ?", [req.user.id], (err, userData) => {
        if (err) return res.status(500).json({ error: "数据库查询失败" });

        // 读取技能经验
        db.get(
            "SELECT combat, mining, fishing, farming, foraging FROM farmer_skills WHERE farmer_id = ?",
            [req.user.id],
            (err, skillData) => {
                if (err) return res.status(500).json({ error: "获取技能经验失败" });

                // 读取背包
                db.all(
                    "SELECT user_items.item_id, items.name, user_items.quantity FROM user_items JOIN items ON user_items.item_id = items.id WHERE user_items.user_id = ?",
                    [req.user.id],
                    (err, items) => {
                        if (err) return res.status(500).json({ error: "获取背包失败" });

                        res.json({
                            money: userData ? userData.money : 0,
                            raisins: userData ? userData.raisins : 0,
                            combat_xp: skillData ? skillData.combat : 0,
                            mining_xp: skillData ? skillData.mining : 0,
                            fishing_xp: skillData ? skillData.fishing : 0,
                            farming_xp: skillData ? skillData.farming : 0,
                            foraging_xp: skillData ? skillData.foraging : 0,
                            backpack: items || [],
                        });
                    }
                );
            }
        );
    });
});

/**
 * 获取 NPC 对农夫的好感度（修改表名为 `affection`）
 */
router.get("/npc-affection", verifyToken, (req, res) => {
    if (req.user.role !== "farmer") {
        return res.status(403).json({ error: "无权限" });
    }

    db.all(
        "SELECT affection.npc_id, users.username AS name, affection.affection FROM affection JOIN users ON affection.npc_id = users.id WHERE affection.farmer_id = ?",
        [req.user.id],
        (err, rows) => {
            if (err) return res.status(500).json({ error: "数据库查询失败" });
            res.json(rows);
        }
    );
});

module.exports = router;

