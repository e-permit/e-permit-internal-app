import { useState } from "react";
import {
  Box,
  Code,
  Divider,
  HStack,
  IconButton,
  List,
  ListItem,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../components/auth/RequireAuth";
import CreateQuota from "../components/authority/CreateQuota";
import FlagIcon from "../components/icons/flags/FlagIcon";
import PermitList from "../components/permit/PermitList";
import QuotaList from "../components/authority/QuotaList";
import { PermitFilterProps } from "../lib/PermitFilterProps";
import Truck from "../components/icons/Truck";


export default function AuthorityDetails() {
  const params = useParams();
  const { resolveAxios, user } = useAuth();
  const { t } = useTranslation(["common", "permit"]);

  const initialFilter: PermitFilterProps = {
    isOwner: true,
    authorityCode: user?.code!,
    selectedAuthorityCode: params.code!,
    permitYear: new Date().getFullYear(),
    permitType: "BILITERAL"
  };
  const [permitFilterProps, setPermitFilterProps] = useState(initialFilter);

  const getAuthority = async (code: string | undefined) => {
    const { data } = await resolveAxios()?.get(`/authorities/${code}`);
    return data;
  };

  const { data, error, isFetching } = useQuery(["authority", params.code], () =>
    getAuthority(params.code)
  );

  const changeOwner = () => {
    setPermitFilterProps({ ...permitFilterProps, isOwner: !permitFilterProps.isOwner });
  }
  if (isFetching) return <Spinner />;
  const filterQuotas = (quotas: []) => {
    const issuer = permitFilterProps.isOwner ? permitFilterProps.authorityCode : permitFilterProps.selectedAuthorityCode;
    const issuedFor = permitFilterProps.isOwner ? permitFilterProps.selectedAuthorityCode : permitFilterProps.authorityCode;
    return quotas.filter((x: any) =>
      x.permit_issuer === issuer &&
      x.permit_issued_for === issuedFor &&
      x.permit_type === permitFilterProps.permitType &&
      x.permit_year === permitFilterProps.permitYear);
  }
  return (
    <Box mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <Box>
        <HStack spacing="10px">
          <FlagIcon code={data.code.toLowerCase()} />
          <Text
            fontSize={{ base: "16px", lg: "17px" }}
            color={useColorModeValue("gray.500", "gray.300")}
            fontWeight={"500"}
            textTransform={"uppercase"}
            mb={"4"}
          >
            {t(`country_name_${data.code.toLowerCase()}`)}
          </Text>
          <Code>{data.api_uri}</Code>
        </HStack>
      </Box>
      <Divider my={"20px"} />
      <SimpleGrid columns={5}>
        <Box>
          <HStack spacing="10px">
            <FlagIcon code={(user?.code!).toLowerCase()} />
            <IconButton aria-label="" onClick={changeOwner} variant={"link"}><Truck  isOwner={permitFilterProps.isOwner}/></IconButton>
            <FlagIcon code={data.code.toLowerCase()} />
          </HStack>
        </Box>

        <Box>
          <HStack spacing="10px">
            <Select size="sm" maxW="130px" value={permitFilterProps.permitType}
              onChange={(e) => { setPermitFilterProps({ ...permitFilterProps, permitType: e.target.value }) }}>
              <option value="BILITERAL">{t("permit:permit_type_biliteral_text")}</option>
              <option value="TRANSIT">{t("permit:permit_type_transit_text")}</option>
              <option value="THIRDCOUNTRY">{t("permit:permit_type_thirdcountry_text")}</option>
            </Select>
          </HStack>
        </Box>
        <Box>
          <HStack spacing="10px">
            <Select size="sm" maxW="80px" value={permitFilterProps.permitYear}
              onChange={(e) => { setPermitFilterProps({ ...permitFilterProps, permitYear: Number.parseInt(e.target.value) }) }}>
              <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
              <option value={new Date().getFullYear() + 1}>{new Date().getFullYear() + 1}</option>
            </Select>
          </HStack>
        </Box>
      </SimpleGrid>

      <Divider my={"20px"} />
      <QuotaList quotas={filterQuotas(data.quotas)} filter={permitFilterProps} />
      <PermitList props={permitFilterProps} />
    </Box>
  );
}
