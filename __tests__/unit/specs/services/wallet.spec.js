import WalletService from '@/services/wallet'
import store from '@/store'

const walletPropertyArray = [
  'address',
  'balance',
  'isDelegate',
  'publicKey'
].sort()
// Note: secondPublicKey, username and vote can also be returned, but are optional

describe('Wallet Service', () => {
  beforeAll(() => {
    store.dispatch('network/setServer', 'https://explorer.ark.io/api/v2')
  })

  it('should return address when searching for existing wallet', async () => {
    const data = await WalletService.find('ATsPMTAHNsUwKedzNpjTNRfcj1oRGaX5xC')
    expect(Object.keys(data).sort()).toEqual(expect.arrayContaining(walletPropertyArray))
  })

  it('should fail when searching for incorrect wallet address', async () => {
    await expect(WalletService.find('AYCTHSZionfGoQsRnv5gECEuFWcZXS38gsx')).rejects.toThrow()
  })

  it('should return a list of top wallet accounts', async () => {
    const { data } = await WalletService.top()
    expect(data).toHaveLength(25)
    data.forEach(wallet => {
      expect(Object.keys(wallet).sort()).toEqual(expect.arrayContaining(walletPropertyArray))
    })
  })

  it('should return top wallets with page offset', async () => {
    const { data } = await WalletService.top(1)
    expect(data).toHaveLength(25)
    data.forEach(wallet => {
      expect(Object.keys(wallet).sort()).toEqual(expect.arrayContaining(walletPropertyArray))
    })
    expect(data.sort((a, b) => a.balance > b.balance)).toEqual(data)
  })

  it('should return top wallets with page offset and given limit', async () => {
    const { data } = await WalletService.top(2, 20)
    expect(data).toHaveLength(20)
    data.forEach(wallet => {
      expect(Object.keys(wallet).sort()).toEqual(expect.arrayContaining(walletPropertyArray))
    })
    expect(data.sort((a, b) => a.balance > b.balance)).toEqual(data)
  })
})
