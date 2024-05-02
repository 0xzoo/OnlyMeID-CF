import {
  FrameHandler,
  FrameContext,
  Button
} from 'frog'
import { checkIfHasOnlyMeID, getProfileDataFromFid } from './airstack/queries'
import { errorScreen } from './components/error'
import { State, onlyMeIDAddress } from './lib/types'
import { publicClient } from './lib/client'
import { abi } from './lib/abi'

// const maxUsers = 9999
// let totalUsers: number

export const startScreen: FrameHandler = async (c: FrameContext) => {
  const fid = c.frameData?.fid as number
  const { deriveState } = c
  // read contract, if totalUsers >= maxUsers, we've reached capacity, check again later
  const { profileData, error } = await getProfileDataFromFid(fid)

  if (error) {
    return c.res({
      image: (errorScreen(error.message)),
      intents: [
        <Button.Transaction target='/claim'>Try Again</Button.Transaction>
      ]
    })
  }

  const { wallets } = profileData
  // only checking primary wallet
  let primaryWallet = wallets[0]
  let walletAddress = primaryWallet.address as `0x${string}`
  deriveState(previousState => {
    let newState = previousState as State
    newState.walletAddress = primaryWallet.address as `0x${string}`
  })

  // if primary wallet isnt on eth?
  // if (primaryWallet.blockchain !== 'Ethereum') {

  // }
  const { hasOnlyMeID, error: hasOMIDError } = await checkIfHasOnlyMeID(primaryWallet.address)
  if (hasOMIDError) {
    return c.res({
      image: (errorScreen(hasOMIDError.message)),
      intents: [<Button.Transaction target='/claim'>Retry</Button.Transaction>]
    })
  } else if (!hasOnlyMeID) {
    return c.res({
      image: (errorScreen('No OnlyMeID found in your connected wallet.')),
      intents: [<Button.Link href='https://app.demos.global'>Mint an OnlyMeID</Button.Link>]
    })
  }

  const isRegistered = await publicClient.readContract({
    address: onlyMeIDAddress,
    args: [walletAddress],
    abi: abi,
    functionName: 'isRegistered',
  })

  deriveState(previousState => {
    let newState = previousState as State
    newState.walletAddress = primaryWallet.address as `0x${string}`
    newState.isRegistered = isRegistered
  })

  const claimEstimate = await publicClient.readContract({
    address: onlyMeIDAddress,
    args: [walletAddress],
    abi: abi,
    functionName: 'claimEstimate',
  })

  const screenText = !hasOnlyMeID
    ? 'Get your OnlyMeID to get started'
    : !isRegistered
      ? 'Register below to enable your claim'
      : 'Claim now'

  // intents
  let intents: JSX.Element[] = []
  hasOnlyMeID
    ? isRegistered
      ? intents.push(<Button.Transaction target="/claim">Claim</Button.Transaction>)
      : intents.push(<Button.Transaction target="/register">Register</Button.Transaction>)
    : intents.push(<Button.Link href='https://app.demos.global/'>Mint an OnlyMeID</Button.Link>)
  intents.push(<Button.Reset>Back</Button.Reset>)

  return c.res({
    action: '/finish',
    image: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
            marginTop: '-30%'
          }}
        >
          <text
            style={{
              fontSize: '60px'
            }}
          >{screenText}</text>
          {isRegistered &&
            (
              <text
                style={{
                  fontSize: '45px'
                }}
              >
                Your estimated claim amount: {claimEstimate} $DEGEN
              </text>
            )
          }
        </div>
      </div>
    ),
    intents: intents
  })
}