export type State = {
  walletAddress: `0x${string}`,
  isRegistered: boolean
}

export type Wallet = {
  address: string,
  blockchain: string
}

export type ProfileData = {
  profileName: string,
  image: string,
  wallets: Wallet[]
}

export type ProfileDataResponse = {
  profileData: ProfileData,
  error: Error
}

export type CIHOMIDResponse = {
  hasOnlyMeID: number,
  error: Error
}

export const onlyMeIDAddress = "0x70468f06cf32b776130e2da4c0d7dd08983282ec"
export const contractAddress = "0x2a6b9af2245f69567d65fc8fa80cc60e0b1762a7"
export const onlyMeIdUrl = "https://app.demos.global/base"