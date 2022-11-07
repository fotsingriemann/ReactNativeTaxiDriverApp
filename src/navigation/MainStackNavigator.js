import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslations } from 'dopenative'
import DriverDrawerNavigator from './DriverDrawerNavigator'
import { IMChatScreen } from '../Core/chat'
import { useAuth } from '../Core/onboarding/hooks/useAuth'
import { logout } from '../Core/onboarding/redux/auth'

const MainStack = createStackNavigator()
const MainStackNavigator = () => {
  const authManager = useAuth()
  const { localized } = useTranslations()
  const currentUser = useSelector(state => state.auth.user)
  const dispatch = useDispatch()

  if (currentUser?.id && currentUser?.role !== 'driver') {
    alert(
      "Your role is not set as a driver. Only drivers are allowed to use this app. Please contact the admin of the app to set your role as a driver. The app won't be functioning properly.",
    )
    authManager?.logout(currentUser)
    dispatch(logout())
  }
  return (
    <MainStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerBackTitle: localized('Back'),
      }}
      initialRouteName="Main">
      <MainStack.Screen
        name={'Main'}
        options={{
          headerShown: false,
        }}
        component={DriverDrawerNavigator}
      />
      <MainStack.Screen name="PersonalChat" component={IMChatScreen} />
    </MainStack.Navigator>
  )
}

export default MainStackNavigator
