import { withLogin } from "src/components/HOC/withLogin";
import Dashboard from "src/features/Dashboard";

export async function getServerSideProps() {
  return {
    redirect: {
      permanent: false,
      destination: "/rooms",
    },
  };
}

export default withLogin(Dashboard);
