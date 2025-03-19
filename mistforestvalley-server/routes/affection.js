const express = require("express");
const db = require("../db");  // 数据库连接
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * 获取 NPC 对所有农夫的好感度
 * 仅管理员和 NPC 本人可查看
 */
router.get("/:npc_id", verifyToken, (req, res) => {
    const npc_id = req.params.npc_id;
    if (req.user.role !== "admin" && req.user.id !== parseInt(npc_id)) {
        return res.status(403).json({ error: "无权限访问" });
    }

    db.all("SELECT farmer_id, affection FROM affection WHERE npc_id = ?", [npc_id], (err, rows) => {
        if (err) return res.status(500).json({ error: "数据库查询错误" });
        res.json(rows);
    });
});

/**
 * 获取某个农夫的所有 NPC 好感
 * 仅限农夫本人可查看
 */
router.get("/farmer/:farmer_id", verifyToken, (req, res) => {
    const farmer_id = req.params.farmer_id;
    if (req.user.role !== "admin" && req.user.id !== parseInt(farmer_id)) {
        return res.status(403).json({ error: "无权限访问" });
    }

    db.all("SELECT npc_id, affection FROM affection WHERE farmer_id = ?", [farmer_id], (err, rows) => {
        if (err) return res.status(500).json({ error: "数据库查询错误" });
        res.json(rows);
    });
});

/**
 * 更新 NPC 对农夫的好感度
 */
router.post("/update", verifyToken, (req, res) => {
    const { npc_id, farmer_id, affection } = req.body;

    if (req.user.role !== "admin" && req.user.id !== parseInt(npc_id)) {
        return res.status(403).json({ error: "无权限修改" });
    }

    db.run(
        "INSERT INTO affection (npc_id, farmer_id, affection) VALUES (?, ?, ?) ON CONFLICT(npc_id, farmer_id) DO UPDATE SET affection = ?",
        [npc_id, farmer_id, affection, affection],
        (err) => {
            if (err) return res.status(500).json({ error: "更新失败" });
            res.json({ success: true, message: "好感度已更新" });
        }
    );
});

module.exports = router;
