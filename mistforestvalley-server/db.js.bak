//include---------------------------------------------------------------------------
const sqlite3 = require("sqlite3").verbose();

//链接SQL数据库----------------------------------------------------------------------
const db = new sqlite3.Database("./mistforestvalley.db", (err) => {
    if (err) {
        console.error("❌ 数据库连接失败:", err.message);
    } else {
        console.log("✅ 成功连接到 SQLite 数据库");
    }
});

module.exports = db; // 导出数据库对象