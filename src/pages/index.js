import { getCookie } from "cookies-next";
import HomePage from "src/features/HomePage";

export async function getServerSideProps(ctx) {
  if (getCookie("access_token", ctx)) {
    return {
      redirect: {
        permanent: false,
        destination: "/rooms",
      },
    };
  }

  return {
    props: {},
  };
}

export default HomePage;
