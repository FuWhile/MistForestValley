/*-----------------------------------
//file name: server.cpp
-------------------------------------
//Date:2025-03-09
//author: FuWhile
-------------------------------------*/
#include "crow.h"
#include <iostream>
#include <sqlite3.h>

//window enter fixer
#ifdef _WIN32
#include <windows.h>
#endif

//---------------------SQL inilization
sqlite3* initDatebase(){
    sqlite3* db; //SQL指针的定义
    int rc=sqlite3_open("mistforestvalley.db",&db); //打开数据库文件

    if(rc){
        std::cerr<<"无法打开数据库： "<<sqlite3_errmsg(db)<<std::endl;
        return nullptr; //返回空指针
    }

    return db; //返回数据库指针

}

//---------------------Server
int main(){
    //Crow Web server inilize
    crow::SimpleApp app;

    //Front Page
    CROW_ROUTE(app,"/")([](){
        crow::response res("欢迎来到雾森谷 : Mist Forest Valley！"); //直接返回字符串
        res.set_header("Content-Type", "text/html; charset=UTF-8"); // 强制 UTF-8
        return res;
    });

    //API
    // 处理 API 请求，返回服务器状态的 JSON 数据
    CROW_ROUTE(app, "/api/status")([]() {
        crow::json::wvalue response; // 定义 JSON 结构
        response["status"] = "服务器运行中"; // 设置 JSON 键值对
        response["version"] = "1.0.0"; // 版本信息
        return response; // 返回 JSON 响应
    });

    //Server Information
    std::cout << "Crow server is running at http://localhost:5000" << std::endl; // 输出服务器启动信息
    app.port(5000).multithreaded().run(); // 启动 Crow 服务器，监听 5000 端口，并启用多线程处理请求

    return 0; // 程序正常结束
}
