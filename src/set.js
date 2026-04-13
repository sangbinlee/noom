// set.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function configureApp(app) {
  // 뷰 엔진 설정
  app.set("view engine", "pug");
  app.set("views", path.join(__dirname, "views"));

  // 정적 파일 제공
  app.use("/public", express.static(path.join(__dirname, "public")));

  // 기본 라우트
  app.get("/", (req, res) => {
    res.render("home", { title: "Home Page", message: "Hello from Pug!" });
  });


  // app.get("/*", (_, res) => {
  //   res.redirect("/");
  // });



}