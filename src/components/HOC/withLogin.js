import { Suspense, useContext } from "react";
import LoadingScreen from "src/components/LoadingScreen";
import { AuthContext } from "src/context/authContext";

export const withLogin =
  (Component, checkLogin = true) =>
  // eslint-disable-next-line react/display-name
  ({ ...props }) => {
    const { isLoadingAuth, user, setUser } = useContext(AuthContext);
    return (
      <Suspense fallback={<LoadingScreen />}>
        {isLoadingAuth || !user ? <LoadingScreen /> : <Component {...props} user={user} setUser={setUser} />}
      </Suspense>
    );
  };

export default withLogin;
