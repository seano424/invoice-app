import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { RecoilRoot } from 'recoil'
import { ThemeProvider } from 'next-themes'
import { store } from '../redux/store'
import { Provider } from 'react-redux'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <ThemeProvider attribute="class">
      <SessionProvider session={session}>
        <Provider store={store}>
          <RecoilRoot>
            <Component {...pageProps} />
          </RecoilRoot>
        </Provider>
      </SessionProvider>
    </ThemeProvider>
  )
}

export default MyApp
