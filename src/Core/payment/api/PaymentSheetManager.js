import PaymentRequestAPI from './PaymentRequestAPI'

export default class PaymentSheetManager {
  constructor(appConfig) {
    this.appConfig = appConfig
    this.paymentRequestAPI = new PaymentRequestAPI(this.appConfig)
    this.stripeCustomerID = null
    this.stripeClientSecret = null
  }

  retrieveSheetKeys = async (email, totalPrice) => {
    this.totalPrice = Number(totalPrice)
    const res = await this.paymentRequestAPI.setupStripe(email)

    if (!res?.success || !res.data?.customerId) {
      // failed to set up stripe customer
      return null
    }

    this.stripeCustomerID = res.data.customerId
    this.stripeClientSecret = res.data.clientSecret

    return this.fetchPaymentSheetKeys()
  }

  fetchPaymentSheetKeys = async () => {
    const amount = Math.floor(this.totalPrice * 100)

    const res = await this.paymentRequestAPI.getPaymentSheetKeys(
      this.stripeCustomerID,
      this.appConfig.currencyCode,
      amount,
    )

    if (!res?.success || !res.data?.paymentIntent) {
      // failed to config payment sheet
      return null
    }

    const { ephemeralKey, paymentIntent, customer } = res.data

    return {
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      clientSecret: this.stripeClientSecret,
    }
  }

  constructApplePayOptions = appleCartItems => {
    return {
      cartItems: appleCartItems,
      country: 'US',
      currency: 'USD',
      // shippingMethods: [
      //   {
      //     amount: '20.00',
      //     identifier: 'DPS',
      //     label: 'Courier',
      //     detail: 'Delivery',
      //     type: 'final',
      //   },
      // ],
      requiredShippingAddressFields: ['emailAddress', 'phoneNumber'],
      requiredBillingContactFields: ['phoneNumber', 'name'],
    }
  }
}
