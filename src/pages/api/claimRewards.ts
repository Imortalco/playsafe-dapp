// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
'use client'

import type { NextApiRequest, NextApiResponse } from 'next'
import { useState } from 'react'
import { CoinsProvider, useCoinContext } from 'helpers/CoinContext'

type Data = {
  name?: string
}
let balance = 0;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) { 
    // if(req.method === 'POST'){
    //   console.log(req.body);
    //   //balance = req.body.coinBalance;
    //   res.redirect(307,`/unlock/50`)
    // }
    // else {
    //   console.log('Day post bree !');
    // }
    
    let balance = req.query.balance;
    res.redirect(307,`/unlock/${balance}`)
 
}
