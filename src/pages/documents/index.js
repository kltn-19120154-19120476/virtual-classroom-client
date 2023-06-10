import withLogin from "src/components/HOC/withLogin";

function DocumentPage({ user }) {
  return <div>{JSON.stringify(user)}</div>;
}

export default withLogin(DocumentPage);
