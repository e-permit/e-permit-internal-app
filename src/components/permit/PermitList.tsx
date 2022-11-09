import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Spinner, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import {
    PaginationState,
    useReactTable,
    getCoreRowModel,
    ColumnDef,
    flexRender,
} from '@tanstack/react-table';
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/RequireAuth";
import { PermitViewModal } from "./PermitView";
type Permit = {
    "permit_id": string;
    "issued_at": string;
    "expire_at": string;
    "plate_number": string;
    "company_id": string;
    "company_name": string;
}

export interface PermitListProps {
    "issuer": string | undefined;
    "issued_for": string | undefined;
    "permit_type": string;
    "permit_year": number;
}

export default function PermitList({ props }: { props: PermitListProps }) {
    const { t } = useTranslation(["permit"]);
    const columns = useMemo<ColumnDef<Permit>[]>(
        () => [{
            accessorKey: 'permit_id',
            header: () => <span>{t("permit_id_label")}</span>,
            width: 240,
            footer: props => props.column.id,
        },
        {
            accessorKey: 'issued_at',
            header: () => <span>{t("issued_at_label")}</span>,
            footer: props => props.column.id,
        },
        {
            accessorKey: 'expire_at',
            header: () => <span>{t("expire_at_label")}</span>,
            footer: props => props.column.id,
        },
        {
            accessorKey: 'plate_number',
            header: () => <span>{t("plate_number_label")}</span>,
            footer: props => props.column.id,
        },
        {
            accessorKey: 'company_name',
            header: () => <span>{t("company_name_label")}</span>,
            footer: props => props.column.id,
        },
        {
            accessorKey: 'company_id',
            header: () => <span>{t("company_id_label")}</span>,
            footer: props => props.column.id,
        },
        {
            accessorKey: 'command',
            header: () => <IconButton
                aria-label="add"
                variant="ghost"
                m={4}
                colorScheme="teal"
                icon={<AddIcon />}
            />,
            cell: props => <PermitViewModal id={props.row.getValue("permit_id")} />,
        }
        ],
        []
    );
    const [{ pageIndex, pageSize }, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        })
    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )
    const fetchPermitsOptions = {
        page: pageIndex,
        issuer: props.issuer,
        issued_for: props.issued_for,
        permit_year: props.permit_year,
        permit_type: props.permit_type
    }
    const { resolveAxios } = useAuth();
    const getPermits = async (options: any) => {
        console.log(options);
        const { data } = await resolveAxios()?.get(
            `/permits?page=${options.page}&&issuer=${options.issuer}` +
            `&&issued_for=${options.issued_for}&&permit_year=${options.permit_year}&&permit_type=${options.permit_type}`);
        return data;
    };

    const { data, error, isFetching } = useQuery(["permits", fetchPermitsOptions], () =>
        getPermits(fetchPermitsOptions)
    );

    const table = useReactTable({
        data: data?.content ?? [],
        columns,
        pageCount: data?.total_pages ?? -1,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        debugTable: true,
    });
    if (isFetching) return <Spinner />;
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
            {t("permit_list_label")}
        </Text>
        <Table>
            <Thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <Th key={header.id}>{header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}</Th>
                        ))}
                    </Tr>
                ))}
            </Thead>
            <Tbody>
                {table.getRowModel().rows.map(row => {
                    return (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map(cell => {
                                return (
                                    <Td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </Td>
                                )
                            })}
                        </Tr>
                    )
                })}
            </Tbody>
        </Table>
        <Flex justifyContent="space-between" m={4} alignItems="center">
            <Flex>
                <Tooltip label={t("previous_page_text")}>
                    <IconButton
                        aria-label="prev"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        icon={<ChevronLeftIcon h={6} w={6} />}
                    />
                </Tooltip>
            </Flex>

            <Flex alignItems="center">
                <NumberInput ml={2}
                    mr={8}
                    w={28}
                    min={1}
                    max={table.getPageCount()}
                    onChange={(_, n) => {
                        const page = n ? n - 1 : 0;
                        table.setPageIndex(page)
                    }}
                    defaultValue={pageIndex + 1}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </Flex>

            <Flex>
                <Tooltip label={t("next_page_text")}>
                    <IconButton
                        aria-label="next"
                        onClick={() => table.nextPage()}
                        isDisabled={!table.getCanNextPage()}
                        icon={<ChevronRightIcon h={6} w={6} />}
                    />
                </Tooltip>
            </Flex>
        </Flex>
    </Box>
}