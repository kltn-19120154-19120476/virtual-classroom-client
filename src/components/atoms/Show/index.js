export const Show = ({ when, fallback = null, children }) => <>{when ? children : fallback || <></>}</>;
