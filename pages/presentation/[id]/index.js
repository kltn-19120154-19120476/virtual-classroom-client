import { useRouter } from "next/router";
import React from "react";
import PresentationDetail from "../../../features/Presentation/Detail";
const PresentationDetailPage = () => {
  const router = useRouter();

  const { id } = router.query;

  return <PresentationDetail id={id} />;
};

export default PresentationDetailPage;
