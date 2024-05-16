import {
  init,
  fetchQuery
} from "@airstack/airstack-react"
import { AIRSTACK_API_KEY } from "./key.js"
import {
  CIHOMIDResponse,
  ProfileDataResponse,
  onlyMeIDAddress
} from "../lib/types.js"

init(AIRSTACK_API_KEY)

export async function getProfileDataFromFid(fid: number): Promise<ProfileDataResponse> {
  const query = `
    query MyQuery($userId: String!) {
      Socials(
        input: {filter: { userId: {_eq: $userId}}, blockchain: ethereum}
      ) {
        Social {
          profileName
          profileImage
          connectedAddresses {
            address
            blockchain
          }
        }
      }
    }
  `

  const { data, error } = await fetchQuery(query, { userId: fid?.toString() })
  if (error) console.log('profileData error', error)
  const profileData = {
    profileName: data.Socials.Social[0].profileName,
    image: data.Socials.Social[0].profileImage,
    wallets: data.Socials.Social[0].connectedAddresses
  }
  return { profileData, error }
}

export async function checkIfHasOnlyMeID(wallet: string): Promise<CIHOMIDResponse> {
  const query = `
    query MyQuery($walletAddress: Identity!, $onlyMeIDAddress: Address!) {
      TokenBalances(
        input: {filter: {owner: {_eq: $walletAddress}, tokenAddress: {_eq: $onlyMeIDAddress}}, blockchain: base, limit: 1}
      ) {
        TokenBalance {
          amount
        }
      }
    }
  `

  const { data, error } = await fetchQuery(query, { walletAddress: wallet, onlyMeIDAddress: onlyMeIDAddress })
  const tokenBalance = data.TokenBalances.TokenBalance
  const hasOnlyMeID = tokenBalance ? Number(tokenBalance[0].amount) : 0
  return { hasOnlyMeID, error }
}