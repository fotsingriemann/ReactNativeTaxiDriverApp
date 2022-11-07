import { firebase } from '../../api/firebase/config'
import { getUnixTimeStamp } from '../../helpers/timeFormat'

export class ReviewAPIManager {
  constructor(reviewsTableName, entityTableName) {
    if (!reviewsTableName || !entityTableName) {
      return
    }
    this.reviewRef = firebase.firestore().collection(reviewsTableName)
    this.entityRef = firebase.firestore().collection(entityTableName)
  }

  subscribeReviews(entityID, callback) {
    if (!entityID || !this.reviewRef) {
      return () => {}
    }
    this.query = this.reviewRef.where('entityID', '==', entityID)

    return this.query.onSnapshot(
      querySnapshot => {
        var reviews = []
        querySnapshot?.forEach(doc => {
          const singleReview = doc.data()
          reviews.push({
            id: doc.id,
            singleReview,
          })
        })

        callback?.(reviews)
      },
      error => {
        console.log(error)
      },
    )
  }

  addReview(entityID, rating, text, user) {
    if (!entityID) {
      return
    }

    const id = this.reviewRef.doc().id
    this.reviewRef
      .doc(id)
      .set({
        author: user,
        authorID: user.id,
        authorName: `${user.firstName} ${user.lastName}`,
        authorProfilePic: user.profilePictureURL,
        createdAt: getUnixTimeStamp(),
        entityID: entityID,
        id,
        rating,
        text,
      })
      .then(() => {
        this.entityRef
          .doc(entityID)
          .get()
          .then(doc => {
            if (!doc?.exists) {
              return
            }
            const data = doc.data()
            let totalNReviews = data.totalNReviews ?? 0
            let sumOfRatings = data.sumOfRatings ?? 0

            totalNReviews += 1
            sumOfRatings += rating

            const avgRating = (sumOfRatings / totalNReviews).toFixed(1)
            this.entityRef.doc(entityID).update({
              totalNReviews,
              sumOfRatings,
              avgRating,
            })
          })
      })
      .catch(error => console.log(error))
  }
}
