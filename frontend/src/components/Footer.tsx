export const Footer = () => {

  return (
    <footer className="p-4 bg-white sm:p-6 dark:bg-gray-900">
        <div className="md:flex md:justify-between">
            <div className="flex flex-auto justify-evenly">
                <div>
                    <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources </h2>
                    <ul className="text-gray-600 dark:text-gray-400">
                        <li className="mb-4">
                            <a href="/about" className="hover:underline">About</a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white"> Follow us</h2>
                    <ul className="text-gray-600 dark:text-gray-400">
                        <li className="mb-4">
                            <a href="https://twitter.com/GonnaMakeIt_HQ" className="hover:underline ">Twitter</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>

  );
};
