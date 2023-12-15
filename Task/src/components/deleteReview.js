import { getFirestore, doc, deleteDoc } from 'firebase/firestore';

const deleteReview = async (reviewId) => {
  const db = getFirestore();
  const reviewRef = doc(db, 'reviews', reviewId);

  try {
    await deleteDoc(reviewRef);
    console.log('Review deleted successfully');
  } catch (error) {
    console.error('Error deleting review:', error);
  }
};
