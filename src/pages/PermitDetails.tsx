import { Box, Spinner } from "@chakra-ui/react";
import PermitView from "../components/permit/PermitView";
import ActivityList from "../components/permit/ActivityList";
import { useAuth } from "../components/auth/RequireAuth";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function PermitDetails() {
  //const { resolveAxios } = useAuth();
  const params = useParams();
 /* const getPermit = async (id: string | undefined) => {
    const { data } = await resolveAxios()?.get(`/permits/find/${id}`);
    return data;
  };
  const { data, error, isFetching } = useQuery(["permit", params.id], () =>
    getPermit(params.id)
  );
  if (error || !data) return <div>Request Failed</div>;
  if (isFetching) return <Spinner />;*/
  return (
    <Box mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <PermitView id={params.id}  inModal={false}  />
    </Box>
  );
}
