import { MoonIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/dist/client/router'
import { signIn, useSession, signOut } from 'next-auth/react'

function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  return (
    <div className="bg-gray-700 w-full pr-4 fixed top-0">
      <ul className="flex justify-between items-center">
        {/* Left Side - Logo */}
        <div>
          <li className="cursor-pointer" onClick={() => router.push('/')}>
            <svg
              width="72"
              height="72"
              viewBox="0 0 72 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 0H52C63.0457 0 72 8.95431 72 20V52C72 63.0457 63.0457 72 52 72H0V0Z"
                fill="#7C5DFA"
              />
              <mask
                id="mask0"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="72"
                height="72"
              >
                <path
                  d="M0 0H52C63.0457 0 72 8.95431 72 20V52C72 63.0457 63.0457 72 52 72H0V0Z"
                  fill="white"
                />
              </mask>
              <g mask="url(#mask0)">
                <path
                  d="M72 36.3496H20C8.95431 36.3496 0 45.3039 0 56.3496V88.3496C0 99.3953 8.95431 108.35 20 108.35H72V36.3496Z"
                  fill="#9277FF"
                />
              </g>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M29.486 23.0003L36 35.8995L42.514 23.0003C46.9652 25.3092 50 29.9105 50 35.21C50 42.8261 43.732 49.0002 36 49.0002C28.268 49.0002 22 42.8261 22 35.21C22 29.9105 25.0348 25.3092 29.486 23.0003Z"
                fill="white"
              />
            </svg>
          </li>
        </div>

        {/* Right Side - Dark Mode and User */}
        <div className="flex items-center divide-secondary-purple space-x-2">
          <div className="cursor-pointer">
            <MoonIcon className="h-10 w-10 text-secondary" />
          </div>
          <div className="bg-secondary-text w-[.01rem] h-[4.5rem]" />
          {session ? (
            <div className=" cursor-pointer">
              <img
                onClick={signOut}
                className="w-10 h-10 rounded-full"
                src={session?.user?.image}
                alt="Profile Image for User"
              />
            </div>
          ) : (
            <button className="text-white font-bold text-sm" onClick={signIn}>
              Sign In
            </button>
          )}
        </div>
      </ul>
    </div>
  )
}

export default Header
