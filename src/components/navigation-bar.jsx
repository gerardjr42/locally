export function NavigationBar() {
  return (
    <div className="drawer">
      <input
        id="account-menu-drawer"
        type="checkbox"
        className="drawer-toggle"
      />
      <div className="drawer-content flex flex-row justify-between p-3">
        <div>
            <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
            </svg> 
        </div>

        <div>
            <img
            src="/images/teallocally.png"
            alt="Locally Logo"
            className="h-10 w-auto"
            />
        </div>

        <div>
            <label
            htmlFor="account-menu-drawer"
            className="drawer-button"
            >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
            </svg>
            </label>
        </div>
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor="account-menu-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          <li>
            <a>Sidebar Item 1</a>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

