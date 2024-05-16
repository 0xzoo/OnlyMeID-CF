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

export const onlyMeIDAddress = "0xe03ae6bf63cd7f893404e097b21a2d9de7bff2f0"
export const contractAddress = "0x70468f06cf32b776130e2da4c0d7dd08983282ec"
export const onlyMeIdUrl = "https://app.demos.global/base"