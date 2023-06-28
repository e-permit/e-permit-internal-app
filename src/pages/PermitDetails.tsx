import { Box } from "@chakra-ui/react";
import PermitView from "../components/permit/PermitView";
import { useParams } from "react-router-dom";

export default function PermitDetails() {
  const params = useParams();
  return (
    <Box mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <PermitView id={params.id}  inModal={false}  />
    </Box>
  );
}
