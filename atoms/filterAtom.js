import { atom } from 'recoil'

export const draftState = atom({
  key: 'draftState',
  default: false,
})

export const pendingState = atom({
  key: 'pendingState',
  default: false,
})

export const paidState = atom({
  key: 'paidState',
  default: false,
})
