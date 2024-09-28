import Logo from 'next/image';

export default function Home() {
  return (
    <div className="Home">
      <div className="container">
        <div>
          <Logo
            className="Logo"
            src="/images/logo.png"
            alt="Description of your image"
            width={300}
            height={200}
          />
        </div>
        <div>
          <button> Log in</button>
          <button>Create account</button>
        </div>
      </div>
    </div>
  );
}
