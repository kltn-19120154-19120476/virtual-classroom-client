export const Show = ({ when, fallback, children }) => <>{when ? children : fallback || <></>}</>;
