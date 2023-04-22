import { axiosInstance } from "../../client/bbb-client";

// const createChecksum = (apiCall, params, secret = BBB_SECRET) => {
//     const queryString = new URLSearchParams(params).toString();
//     return sha1(`${apiCall}${queryString}${secret}`);
// };

export default async function handler(req, res) {
    try {
        const result = await axiosInstance("join", {
            params: {
                ...req.query,
            },
        });

        return res.status(200).send({ data: result.request.res.responseUrl });
    } catch (err) {
        res.status(500).send({ error: "failed to fetch data" });
    }
}
