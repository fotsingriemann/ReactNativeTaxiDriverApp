import React, { useState, useLayoutEffect, useEffect, useRef } from 'react'
import { View, FlatList, TouchableOpacity } from 'react-native'
import { ReviewAPIManager } from '../../api/ReviewAPIManager'
import FastImage from 'react-native-fast-image'
import { useTheme, useTranslations } from 'dopenative'
import { connect, useSelector } from 'react-redux'
import IMAddReviewModal from '../../components/IMAddReviewModal/IMAddReviewModal'
import dynamicStyles from './styles'
import { TNEmptyStateView } from '../../../truly-native'
import IMVendorReviewItem from './IMVendorReviewItem/IMVendorReviewItem'
import { useReviewsConfig } from '../../hooks/useReviewsConfig'

function IMVendorReview({ navigation, user, route }) {
  const currentUser = useSelector(state => state.auth.user)

  const [reviews, setReviews] = useState([])
  const [isVisible, setVisible] = useState(false)
  const [loading, setLoading] = useState(true)

  const id = route.params?.entityID ?? ''

  const { config } = useReviewsConfig()
  const isVendorAdmin =
    currentUser?.role === 'vendor' && currentUser.vendorID === id

  const apiManager = useRef(
    new ReviewAPIManager(
      config?.tables?.vendorReviewsTableName,
      config?.tables?.vendorProductsTableName,
    ),
  ).current

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const emptyStateConfig = {
    title: localized('No reviews'),
    description: localized('There are currently no reviews for this vendor.'),
  }

  if (!isVendorAdmin) {
    emptyStateConfig.buttonName = localized('Add Review')
    emptyStateConfig.onPress = showModal
  }

  useEffect(() => {
    const unsubscribe = apiManager.subscribeReviews(id, onReviewsFetched)
    return unsubscribe
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: renderHeaderRight,
    })
  }, [])

  const onReviewsFetched = newReviews => {
    setReviews(newReviews)
    setLoading(false)
  }

  const renderHeaderRight = () => {
    if (!isVendorAdmin) {
      return (
        <TouchableOpacity onPress={() => showModal()}>
          <FastImage
            tintColor={theme.colors[appearance].primaryForeground}
            style={styles.headerRightContainer}
            source={theme.icons.create}
          />
        </TouchableOpacity>
      )
    }
  }

  function showModal() {
    setVisible(true)
  }

  const renderSingleReview = ({ item, index }) => {
    return (
      <IMVendorReviewItem
        singleReview={item?.singleReview}
        key={`${item?.id ?? index}`}
      />
    )
  }
  return (
    <View style={styles.container}>
      <IMAddReviewModal
        isVisible={isVisible}
        close={() => setVisible(false)}
        submitReview={(rating, review) =>
          apiManager.addReview(id, rating, review, user)
        }
      />
      {reviews.length === 0 && !loading && (
        <>
          <TNEmptyStateView
            emptyStateConfig={emptyStateConfig}
            style={styles.emptystateConfig}
          />
        </>
      )}

      <FlatList
        data={reviews}
        renderItem={renderSingleReview}
        style={styles.container}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

const mapStateToProps = state => ({
  user: state.auth.user,
})

export default connect(mapStateToProps)(IMVendorReview)
