export const baseURL = 'https://snehalayaa.brightoncloudtech.com/api/v1'
export const baseURLV2 = 'https://snehalayaa.brightoncloudtech.com/api/v2'
// export const baseURL = 'http://192.168.29.236:8080/api/v1'
// export const baseURL = 'http://192.168.29.236:8080/api/v1'
// export const baseURL = 'http://192.168.29.236:8080/api/v1'

export const ACCESS_TOKEN =
  '2b103L8vQ3zy2LfepYP3d2U75OSmG0ZZh23sdr81waRw1acoQsq3sdfddweweweqweGyFH7eN8i3hu'

export const formatINR = (amount: number | string): string => {
  if (!amount) return '₹0.00'
  const value = typeof amount === 'string' ? parseFloat(amount) : amount
  return value.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
