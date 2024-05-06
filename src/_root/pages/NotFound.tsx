import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="page_404 flex items-center justify-center min-h-screen bg-black font-arvo w-screen">
      <div className="container mx-auto">
        <div className="row flex justify-center">
          <div className="col-sm-12 text-center">
            <div className="bg-center bg-cover mx-auto w-full">
              <h1 className="text-9xl">404</h1>
            </div>

            <h3 className="text-2xl sm:text-[80px] leading-loose">Look like you're lost</h3>
            <p className="text-2xl leading-[8rem]">
              The page you are looking for not available!
            </p>

            <Link
              to={`/`}
              className="m-auto flex justify-center mt-4 px-5 py-5 text-white shad-button_primary w-2/4 rounded">
              <p>Back to Home page</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
