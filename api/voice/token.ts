import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AccessToken, AgentDispatchClient } from 'livekit-server-sdk';
import { randomUUID } from 'node:crypto';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const {LIVEKIT_URL,LIVEKIT_API_KEY,LIVEKIT_API_SECRET}=process.env;
  if (!LIVEKIT_URL||!LIVEKIT_API_KEY||!LIVEKIT_API_SECRET)
    return res.status(503).json({error:'LiveKit has not been configured for this deployment.'});
  const persona=req.body?.persona;
  if (!['Mario','Joyce'].includes(persona)) return res.status(501).json({error:'This voice provider is not yet enabled.'});
  try {
    const room='founder-'+randomUUID();
    const token=new AccessToken(LIVEKIT_API_KEY,LIVEKIT_API_SECRET,{identity:'visitor-'+randomUUID(),ttl:'20m'});
    token.addGrant({roomJoin:true,room,canPublish:true,canSubscribe:true});
    const dispatcher=new AgentDispatchClient(LIVEKIT_URL,LIVEKIT_API_KEY,LIVEKIT_API_SECRET);
    await dispatcher.createDispatch(room,persona.toLowerCase());
    return res.status(200).json({url:LIVEKIT_URL,token:await token.toJwt()});
  } catch(err) {
    console.error('Voice dispatch error',err);
    return res.status(503).json({error:'Live voice worker unavailable.'});
  }
}
