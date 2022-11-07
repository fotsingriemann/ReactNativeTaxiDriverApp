import React, { useEffect } from 'react'
import { StatusBar } from 'react-native'
// import stripe from 'tipsi-stripe'
import { OnboardingConfigProvider } from './src/Core/onboarding/hooks/useOnboardingConfig'
import { useConfig } from './src/config'
import { ProfileConfigProvider } from './src/Core/profile/hooks/useProfileConfig'
import RootNavigator from './src/navigation/Root'

const MainNavigator = RootNavigator

export default AppContent = () => {
  const config = useConfig()

  useEffect(() => {
    // stripe.setOptions({
    //   publishableKey: config.STRIPE_CONFIG.PUBLISHABLE_KEY,
    //   merchantId: config.STRIPE_CONFIG.MERCHANT_ID,
    //   androidPayMode: config.STRIPE_CONFIG.ANDROID_PAYMENT_MODE,
    // })
  }, [])

  return (
    <ProfileConfigProvider config={config}>
      <OnboardingConfigProvider config={config}>
        <StatusBar barStyle="dark-content" />
        <MainNavigator />
      </OnboardingConfigProvider>
    </ProfileConfigProvider>
  )
}
