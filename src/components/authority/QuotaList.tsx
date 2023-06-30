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
    const { t } = useTranslation();
    quotas = quotas.sort((a, b) => a.end_number - b.end_number);
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
                {t("Quotas")}
            </Text>
            <Table>
                <Thead>
                    <Tr>
                        <Th key="start_number">{t("Start")}</Th>
                        <Th key="end_number">{t("End")}</Th>
                        <Th key="used_quota">{t("Used")}</Th>
                        <Th key="remain_quota">{t("Remain")}</Th>
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