import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename=fileURLToPath(import.meta.url), __dirname=path.dirname(__filename);
const allowedProtocols=new Set(["http:","https:"]);

async function startServer(){
 const app=express(); const server=createServer(app); app.use(express.json({limit:"1mb"}));

 app.get("/api/tools",(_req,res)=>res.json({tools:[
  {id:"browser",label:"Live Browser",status:process.env.BROWSER_TOOL_URL?"ready":"configure",capabilities:["navigate","research","source capture","handoff"]},
  {id:"commerce",label:"Commerce",status:"ready",capabilities:["catalog","recommend","cart","policy"]},
  {id:"analyze-url",label:"Analyze URL",status:"ready",capabilities:["metadata","content-type","reachability"]},
  {id:"builder",label:"Build Runner",status:process.env.BUILD_TOOL_URL?"ready":"configure",capabilities:["build","test","preview"]},
 ]}));

 app.post("/api/tools/analyze-url",async(req,res)=>{
  try{
   const raw=String(req.body?.url||""); const url=new URL(raw);
   if(!allowedProtocols.has(url.protocol)) return res.status(400).json({ok:false,error:"Only HTTP(S) URLs are allowed"});
   const response=await fetch(url,{method:"HEAD",redirect:"follow",signal:AbortSignal.timeout(8000)});
   res.json({ok:true,url:response.url,status:response.status,contentType:response.headers.get("content-type"),observedAt:new Date().toISOString()});
  }catch(error){res.status(502).json({ok:false,error:error instanceof Error?error.message:String(error)});}
 });

 app.post("/api/tools/browser/session",async(req,res)=>{
  const endpoint=process.env.BROWSER_TOOL_URL;
  if(!endpoint) return res.status(503).json({ok:false,status:"BLOCKED",error:"BROWSER_TOOL_URL is not configured"});
  try{
   const upstream=await fetch(endpoint,{method:"POST",headers:{"content-type":"application/json",...(process.env.BROWSER_TOOL_TOKEN?{authorization:`Bearer ${process.env.BROWSER_TOOL_TOKEN}`}:{})},body:JSON.stringify(req.body??{}),signal:AbortSignal.timeout(30000)});
   const text=await upstream.text(); res.status(upstream.status).type(upstream.headers.get("content-type")||"application/json").send(text);
  }catch(error){res.status(502).json({ok:false,status:"BLOCKED",error:error instanceof Error?error.message:String(error)});}
 });

 app.post("/api/tools/build",async(req,res)=>{
  const endpoint=process.env.BUILD_TOOL_URL;
  if(!endpoint) return res.status(503).json({ok:false,status:"BLOCKED",error:"BUILD_TOOL_URL is not configured"});
  try{
   const upstream=await fetch(endpoint,{method:"POST",headers:{"content-type":"application/json",...(process.env.BUILD_TOOL_TOKEN?{authorization:`Bearer ${process.env.BUILD_TOOL_TOKEN}`}:{})},body:JSON.stringify(req.body??{}),signal:AbortSignal.timeout(30000)});
   res.status(upstream.status).send(await upstream.text());
  }catch(error){res.status(502).json({ok:false,status:"BLOCKED",error:error instanceof Error?error.message:String(error)});}
 });

 const staticPath=process.env.NODE_ENV==="production"?path.resolve(__dirname,"public"):path.resolve(__dirname,"..","dist","public");
 app.use(express.static(staticPath)); app.get("*",(_req,res)=>res.sendFile(path.join(staticPath,"index.html")));
 const port=process.env.PORT||3000; server.listen(port,()=>console.log(`Server running on http://localhost:${port}/`));
}
startServer().catch(console.error);
