import axios from 'axios'
import { Platform } from 'react-native'
import { requestOneTimePayment } from 'react-native-paypal'

export default class PaymentRequestAPI {
  constructor(appConfig) {
    this.appConfig = appConfig
  }

  makeRequest = async (endPoint, body) => {
    const apiConnector = axios.create(this.appConfig.serverSideEnv.API)
    let method = 'post'
    if (!body) {
      method = 'get'
    }
    try {
      const response = await apiConnector[method](endPoint, body)

      return { ...response, success: true }
    } catch (error) {
      const stripeError = error.response ? error.response : error
      console.log('serverError: ', stripeError)
      return { stripeError, success: false }
    }
  }

  fetchPaypalTokenFromServer = async () => {
    const endPoint = '/create_token'
    const res = await this.makeRequest(endPoint)

    return res?.data
  }

  checkoutPaypal = async options => {
    const endPoint = '/checkout'
    const body = {
      payment_method_nonce: options.nonce,
      amount: options.amount,
    }

    const res = await this.makeRequest(endPoint, body)

    return res?.data
  }

  chargePaypalCustomer = async ({ amount, currency, token }) => {
    return new Promise(resolve => {
      requestOneTimePayment(token, {
        amount: amount, // required
        currency: currency,
        localeCode: 'en_US',
        shippingAddressRequired: false,
      })
        .then(chargeResponse => resolve({ success: true, ...chargeResponse }))
        .catch(err => resolve({ success: false, error: err }))
    })
  }

  chargeStripeCustomer = async body => {
    const endPoint = '/charge-card-off-session'

    return this.makeRequest(endPoint, body)
  }

  detachCustomerCard = async body => {
    const endPoint = '/detach-card'

    return this.makeRequest(endPoint, body)
  }

  setupStripe = email => {
    const endPoint = '/create-setup-intent'
    const body = {
      email,
    }

    return this.makeRequest(endPoint, body)
  }

  getPaymentSheetKeys = (customerId, currency, amount) => {
    const endPoint = '/payment-sheet'
    const body = {
      customerId,
      currency,
      amount,
    }

    return this.makeRequest(endPoint, body)
  }

  getStripeKeys = () => {
    const endPoint = '/stripe-key'

    return this.makeRequest(endPoint)
  }
}
