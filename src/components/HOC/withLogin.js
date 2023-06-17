import { Suspense, useContext } from "react";
import { AuthContext } from "src/context/authContext";

export const withLogin =
  (Component, checkLogin = true) =>
  // eslint-disable-next-line react/display-name
  ({ ...props }) => {
    const { user, getUser } = useContext(AuthContext);
    return <Suspense>{<Component {...props} user={user} getUser={getUser} />}</Suspense>;
  };

export default withLogin;
