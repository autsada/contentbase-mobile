import { Dispatch, SetStateAction } from 'react'
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore'

type Args<T = Record<string, any>, U = unknown> = {
  collectionName: string
  docId: string
  data: T
  fieldName: string
  fieldValue: any
  setterFn: ((a: U) => void) | Dispatch<SetStateAction<U>>
  initialState: U
}

export function listenToDocUpdate<T extends Record<string, any>>({
  collectionName,
  docId,
  setterFn,
  initialState,
}: Pick<
  Args<{}, T>,
  'collectionName' | 'docId' | 'setterFn' | 'initialState'
>) {
  return firestore()
    .collection(collectionName)
    .doc(docId)
    .onSnapshot((snapshot) => {
      if (snapshot && snapshot.exists) {
        const doc = snapshotToDoc<T>(snapshot)
        setterFn(doc)
      } else {
        setterFn(initialState)
      }
    })
}

export function snapshotToDoc<T extends Record<string, any>>(
  snapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>
) {
  const data = snapshot.data() as T & {
    createdAt: FirebaseFirestoreTypes.Timestamp
    updatedAt?: FirebaseFirestoreTypes.Timestamp
  }

  const createdAt = data?.createdAt ? data.createdAt.toDate().toString() : null
  const updatedAt = data?.updatedAt ? data.updatedAt.toDate().toString() : null

  const doc: T = {
    ...data,
    id: snapshot.id,
    createdAt,
    updatedAt,
  }

  return doc
}

export async function updateDocById<T extends Record<string, any>>({
  collectionName,
  docId,
  data,
}: Pick<Args<T>, 'collectionName' | 'docId' | 'data'>) {
  return firestore()
    .collection(collectionName)
    .doc(docId)
    .set(
      {
        ...data,
        updatedAt: new Date(),
      },
      { merge: true }
    )
}
