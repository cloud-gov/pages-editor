import Link from 'next/link'

const BeforeLogin: React.FC = () => {
  return (
    <div className='oauth'>
      <button>
        <Link href="/api/users/oauth/uaa">
          Login via UAA
        </Link>
      </button>
    </div>
  )
}

export default BeforeLogin
