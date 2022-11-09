import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CreateQuota from "./CreateQuota";

export type AuthorityQuota = {
    start_number: number;
    end_number: number;
}

export default function QuotaList({ quotas }: { quotas: AuthorityQuota[] }) {
    const { t } = useTranslation(["authority"]);
    return <Box>
        <Text
            fontSize={{ base: "14px", lg: "16px" }}
            color={"yellow.500"}
            fontWeight={"400"}
            textTransform={"uppercase"}
            ml={5}
            mb={"4"}
            mt={"5"}
        >
            {t("quota_list_label")}
        </Text>
        <Table>
            <Thead>
                <Tr>
                    <Th key="start_number">{t("start_number_label")}</Th>
                    <Th key="start_number">{t("end_number_label")}</Th>
                    <Th key="start_number">{t("permit:permit_type_label")}</Th>
                    <Th key="start_number">{t("permit:permit_year_label")}</Th>
                    <Th key="used_count">{t("permit:used_count_label")}</Th>
                    <Th key="command"><CreateQuota props={{permit_type: "BILITERAL", permit_year: 2022, authority_code: "UZ"}} /></Th>
                </Tr>
            </Thead>
            <Tbody>
                {quotas.map(row => {
                    return (
                        <Tr>
                            <Td>
                               {row.start_number}
                            </Td>
                            <Td>
                               {row.end_number}
                            </Td>
                        </Tr>
                    )
                })}
            </Tbody>
        </Table>
    </Box>
}