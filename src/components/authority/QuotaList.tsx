import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { PermitFilterProps } from "../../lib/PermitFilterProps";
import CreateQuota from "./CreateQuota";

export type AuthorityQuota = {
    start_number: number;
    end_number: number;
    used_count: number;
}

export default ({ quotas, filter }: { quotas: AuthorityQuota[], filter: PermitFilterProps }) => {
    const { t } = useTranslation(["authority"]);
    return (
        <Box>
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
                        <Th key="end_number">{t("end_number_label")}</Th>
                        <Th key="used_quota">{t("used_quota_label")}</Th>
                        <Th key="remain_quota">{t("remain_quota_label")}</Th>
                        <Th key="command">{!filter.isOwner &&
                            <CreateQuota props={{
                                permitType: filter.permitType,
                                permitYear: filter.permitYear,
                                authorityCode: filter.selectedAuthorityCode
                            }} />}</Th>
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
                                <Td>
                                    {row.used_count}
                                </Td>
                                <Td>
                                    {(row.end_number - (row.start_number + row.used_count -1) )}
                                </Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
        </Box>);
}