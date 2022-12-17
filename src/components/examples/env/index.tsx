import React from "react";

export const EnvExample = () => {
    return (
        <div className="flex justify-center items-center flex-col">
            <h1>ENV EXAMPLE</h1>
            <div>NEXT_PUBLIC_ENV_VARIABLE</div>
            <div>{process.env.NEXT_PUBLIC_ENV_VARIABLE}</div>
            <div>NEXT_PUBLIC_ENV_LOCAL_VARIABLE</div>
            <div>{process.env.NEXT_PUBLIC_ENV_LOCAL_VARIABLE}</div>
            <div>NEXT_PUBLIC_DEVELOPMENT_ENV_VARIABLE</div>
            <div>{process.env.NEXT_PUBLIC_DEVELOPMENT_ENV_VARIABLE}</div>
            <div>NEXT_PUBLIC_PRODUCTION_ENV_VARIABLE</div>
            <div>
                {process.env.NEXT_PUBLIC_PRODUCTION_ENV_VARIABLE ?? "undefined"}
            </div>
        </div>
    );
};
