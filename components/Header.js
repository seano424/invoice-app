import { MoonIcon, SunIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/dist/client/router'
import { signIn, useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { trialModeState } from '../atoms/trialModeAtom'
import { useRecoilState } from 'recoil'
import styles from '@/styles/Header.module.css'
import Logo from 'public/images/logo.svg'

function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [trialMode, setTrialMode] = useRecoilState(trialModeState)

  const handleSignIn = () => {
    setTrialMode(false)
    signIn()
  }

  return (
    <nav className={styles.nav}>
      <ul className={styles.navContainer}>
        {/* Left Side - Logo / Top on XL */}
        <Logo className="cursor-pointer" onClick={() => router.push('/')} />

        {/* Center Trial Mode */}
        {!session && (
          <div
            onClick={() => setTrialMode(!trialMode)}
            className={styles.trialMode}
          >
            <h1>{trialMode ? 'Leave Trial Mode' : 'Click for Trial Mode'}</h1>
          </div>
        )}

        {/* Right Side - Dark Mode and User / Bottom on XL */}
        <div className={styles.features}>
          <div
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={styles.themeIcon}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </div>
          <div className={styles.divider} />
          <div className={styles.session} />
          {session ? (
            <img
              onClick={signOut}
              className="w-10 h-10 rounded-full"
              src={session?.user?.image}
              alt="Profile Image for User"
            />
          ) : (
            <button className={styles.signInBtn} onClick={handleSignIn}>
              Sign In
            </button>
          )}
        </div>
      </ul>
    </nav>
  )
}

export default Header
