import React, { useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme, useTranslations } from 'dopenative'
import IMProfileSettings from '../components/IMProfileSettings/IMProfileSettings'
import { logout } from '../../../onboarding/redux/auth'

const IMProfileSettingsScreen = props => {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()

  const navigation = props.navigation
  const lastScreenTitle = props.route.params?.lastScreenTitle
    ? props.route.params?.lastScreenTitle
    : 'Profile'

  const currentUser = useSelector(state => state.auth.user)

  const dispatch = useDispatch()

  useLayoutEffect(() => {
    const colorSet = theme.colors[appearance]
    navigation.setOptions({
      headerTitle: localized('Settings'),
      headerStyle: {
        backgroundColor: colorSet.primaryBackground,
        borderBottomColor: colorSet.hairline,
      },
      headerTintColor: colorSet.primaryText,
    })
  }, [])

  const onLogout = () => {
    dispatch(logout())
  }

  return (
    <IMProfileSettings
      navigation={props.navigation}
      onLogout={onLogout}
      lastScreenTitle={lastScreenTitle}
      user={currentUser}
    />
  )
}

export default IMProfileSettingsScreen
