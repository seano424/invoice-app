import { useEffect } from 'react'
import Header from '../components/Header'
import Invoices from '../components/Invoices'
import { useDispatch } from 'react-redux'
import { setInvoices } from '../redux/features/invoice/invoiceSlice'
import { db } from '../firebase'
import { trialModeState } from '../atoms/trialModeAtom'
import { useSession } from 'next-auth/react'
import { useRecoilValue } from 'recoil'
import { collection, onSnapshot, query, where } from '@firebase/firestore'

export default function Home() {
  const { data: session } = useSession()
  const dispatch = useDispatch()
  const trialMode = useRecoilValue(trialModeState)
  useEffect(() => {
    session &&
      !trialMode &&
      onSnapshot(
        query(collection(db, 'invoices'), where('uid', '==', session.user.uid)),
        (querySnapshot) => {
          let tempInvoices = querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() }
          })
          dispatch(setInvoices(tempInvoices))
          console.log('invoices', tempInvoices)
        }
      )

    trialMode &&
      onSnapshot(query(collection(db, 'invoices')), (snapshot) => {
        let tempTrialModeInvoices = snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() }
        })
        dispatch(setInvoices(tempTrialModeInvoices))
      })

    !session && !trialMode && dispatch(setInvoices([]))
  }, [db, session, trialMode])

  return (
    <div className="h-screen w-screen flex">
      <Header />
      <Invoices />
    </div>
  )
}
