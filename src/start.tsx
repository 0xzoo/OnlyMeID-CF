import {
  FrameHandler,
  FrameContext,
  Button
} from 'frog'
import {
  checkIfHasOnlyMeID,
  getProfileDataFromFid
} from './airstack/queries'
import { errorScreen } from './components/error'
import {
  State,
  contractAddress,
  onlyMeIdUrl
} from './lib/types'
import { publicClient } from './lib/client'
import { abi } from './lib/abi'
import { formatEther } from 'viem'

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
  if (!wallets || wallets.length == 0) {
    return c.res({
      image: errorScreen('You need a connected wallet to continue'),
      intents: [
        <Button.Reset>Back</Button.Reset>
      ]
    })
  }
  let primaryWallet = wallets[0]
  let walletAddress = `0x${primaryWallet.address.slice(2)}` as `0x${string}`

  // if primary wallet isnt on eth?
  // if (primaryWallet.blockchain !== 'ethereum') {

  // }
  const { hasOnlyMeID, error: hasOMIDError } = await checkIfHasOnlyMeID(primaryWallet.address)
  if (hasOMIDError) {
    console.log('hasOMIDError', hasOMIDError)
    return c.res({
      image: (errorScreen(hasOMIDError.message)),
      intents: [<Button.Transaction target='/claim'>Retry</Button.Transaction>]
    })
  } else if (!hasOnlyMeID) {
    return c.res({
      image: (errorScreen('No OnlyMeID found in your connected wallet.')),
      intents: [<Button.Link href={onlyMeIdUrl}>Mint your OnlyMeID</Button.Link>]
    })
  }

  const isRegistered = await publicClient.readContract({
    address: contractAddress,
    args: [walletAddress],
    abi: abi,
    functionName: 'isRegistered',
  })

  deriveState(previousState => {
    let newState = previousState as State
    newState.walletAddress = `0x${primaryWallet.address.slice(2)}`
    newState.isRegistered = isRegistered
  })

  const claimEstimate = await publicClient.readContract({
    address: contractAddress,
    args: [walletAddress],
    abi: abi,
    functionName: 'claimEstimate',
  })

  const screenText = !hasOnlyMeID
    ? 'Get your OnlyMeID to get started'
    : !isRegistered
      ? 'Register to start earning $DEGEN plus get a starter bonus'
      : 'Claim now'

  const adjustedMarginTop = !hasOnlyMeID
    ? '-30%'
    : !isRegistered
      ? '-32%'
      : '-30%'

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
            marginTop: adjustedMarginTop
          }}
        >
          <text
            style={{
              fontSize: '60px',
              width: '90%',
              textAlign: 'center'
            }}
          >{screenText}</text>
          {isRegistered &&
            (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
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
            )
          }
        </div>
      </div>
    ),
    intents: intents
  })
}