import {
  Button,
  FrameContext,
  FrameHandler,
} from 'frog'
import { publicClient } from './lib/client'
import { State, onlyMeIDAddress } from './lib/types'
import { abi } from './lib/abi'
import { formatEther } from 'viem'


export const finishScreen: FrameHandler = async (c: FrameContext) => {
  const { transactionId, previousState } = c
  const { walletAddress, isRegistered } = previousState as unknown as State

  // should be registered by this point, now to claim
  if (!isRegistered) {
    const claimEstimate = await publicClient.readContract({
      address: onlyMeIDAddress,
      args: [`0x${walletAddress}`],
      abi: abi,
      functionName: 'claimEstimate',
    })

    return c.res({
      action: '/finish',
      image: (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            color: '#FFFFFF'
          }}
        >
          <img
            height='630px'
            width='1200px'
            src='https://github.com/0xzoo/OnlyMeID/raw/main/public/nero.jpg'
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '-33%'
            }}
          >
            <text
              style={{
                fontSize: '60px'
              }}
            >
              You're ready to claim
            </text>
            <text
              style={{
                fontSize: '45px'
              }}
            >
              Your estimated claim amount:
            </text>
            <text
              style={{
                fontSize: '45px'
              }}
            >
              {formatEther(claimEstimate)} $DEGEN
            </text>
          </div>
        </div>
      ),
      intents: [
        <Button.Transaction target='/claim'>Claim</Button.Transaction>
      ]
    })
  }

  const shareUrl = `https://warpcast.com/~/compose?text=I%20just%20claimed%20free%20%24DEGEN%20for%20being%20human%20from%20@demosg&embeds[]=https://demos.z00.workers.dev`
  const txUrl = `https://basescan.org/tx/${transactionId}`
  return c.res({
    image: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          backgroundImage: 'url(https://github.com/0xzoo/OnlyMeID/raw/main/public/nero.jpg)',
          backgroundSize: '100% 100%',
          color: '#FFFFFF',
          textAlign: 'center'
        }}
      >
        <img
          height='630px'
          width='1200px'
          src='https://github.com/0xzoo/OnlyMeID/raw/main/public/nero.jpg'
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '-33%'
          }}
        >
          <h1
            style={{
              fontSize: '60px',
              width: '90%'
            }}
          >
            Come back every day to maximize your claim!
          </h1>
          <text
            style={{
              fontSize: '30px',
              wordBreak: 'break-word',
              marginTop: '20px'
            }}
          >Tx: {transactionId}</text>
        </div>
      </div>
    ),
    intents: [
      <Button.Link href={shareUrl}>Share</Button.Link>,
      <Button.Link href={txUrl}>View on BaseScan</Button.Link>
    ]
  })
}